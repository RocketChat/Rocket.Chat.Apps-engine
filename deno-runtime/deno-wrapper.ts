if (!Deno.args.includes('--subprocess')) {
    Deno.stderr.writeSync(
        new TextEncoder().encode(`
            This is a Deno wrapper for Rocket.Chat Apps. It is not meant to be executed stand-alone;
            It is instead meant to be executed as a subprocess by the Apps-Engine framework.
       `),
    );
    Deno.exit(1001);
}

async function notifyEngine(notify: Record<string, unknown>): Promise<void> {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(JSON.stringify(notify));
    await Deno.stdout.write(encoded);
    return undefined;
}

function getAppDependencies(appSource: string): string[] {
    const regex = /require\((['"])(.+?)\1\)/g;
    const dependencies: string[] = [];

    let match: ReturnType<RegExp['exec']>;

    while (((match = regex.exec(appSource)), match !== null)) {
        dependencies.push(match[2]);
    }

    return dependencies;
}

const ALLOWED_NATIVE_MODULES = ['path', 'url', 'crypto', 'buffer', 'stream', 'net', 'http', 'https', 'zlib', 'util', 'punycode', 'os', 'querystring'];
const ALLOWED_EXTERNAL_MODULES = ['uuid'];

async function buildRequirer(preloadModules: string[]): Promise<(module: string) => unknown> {
    // A simple object is desireable here over a Map, as we're going to do direct lookups
    // and not as many inserts and iterations. For more details https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#objects_vs._maps
    const loadedModules: Record<string, unknown> = Object.create(null);

    await Promise.all(
        preloadModules.map(async (module: string) => {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (loadedModules[module]) {
                return;
            }

            if (ALLOWED_NATIVE_MODULES.includes(module)) {
                loadedModules[module] = await import(`node:${module}`);
                return;
            }

            if (ALLOWED_EXTERNAL_MODULES.includes(module)) {
                loadedModules[module] = await import(`npm:${module}`);
                return;
            }

            if (module.startsWith('@rocket.chat/apps-engine')) {
                const path = module.replace('@rocket.chat/apps-engine/', '../').concat('.js');
                loadedModules[module] = await import(path);
                return;
            }

            throw new Error(`Module ${module} is not allowed`);
        }),
    );

    return (module: string): unknown => {
        console.log('require', module);

        return loadedModules[module];
    };
}

function wrapAppCode(code: string): (require: (module: string) => unknown) => Record<string, unknown> {
    return new Function(
        'require',
        `
        const exports = {};
        const module = { exports };
        const result = (async (exports,module,require,globalThis,Deno) => {
            ${code};
        })(exports,module,require);
        return result.then(() => module.exports);`,
    ) as () => Record<string, unknown>;
}

type JSONRPC_Message = {
    jsonrpc: '2.0-rc';
};

type SuccessResponse = JSONRPC_Message & {
    id: string;
    result: any;
};

type ErrorResponse = JSONRPC_Message & {
    error: {
        code: number;
        message: string;
        data?: Record<string, unknown>;
    };
    id: string | null;
};

type JSONRPC_Response = SuccessResponse | ErrorResponse;

const Messenger = new (class {
    private encoder = new TextEncoder();

    public async successResponse(id: string, ...result: unknown[]): Promise<void> {
        const rpc: SuccessResponse = {
            jsonrpc: '2.0-rc',
            id,
            result,
        };
        const encoded = this.encoder.encode(JSON.stringify(rpc));
        await Deno.stdout.write(encoded);
    }

    public async errorResponse({ error: { message, code = -32000, data }, id }: Omit<ErrorResponse, 'jsonrpc'>): Promise<void> {
        const rpc: ErrorResponse = {
            jsonrpc: '2.0-rc',
            id,
            error: { message, code, ...(data && { data }) },
        };

        const encoded = this.encoder.encode(JSON.stringify(rpc));
        Deno.stdout.write(encoded);
    }
})();

async function handlInitializeApp({ id, source }: { id: string; source: string }): Promise<void> {
    const deps = getAppDependencies(source);
    const require = await buildRequirer(deps);
    const appExports = wrapAppCode(source)(require);
    console.log('appExports', appExports);
}

async function main() {
    setTimeout(() => notifyEngine({ method: 'ready' }), 1_780);

    const decoder = new TextDecoder();

    for await (const chunk of Deno.stdin.readable) {
        const message = decoder.decode(chunk);
        const { method, params, id } = JSON.parse(message);

        switch (method) {
            case 'construct': {
                const [appId, source] = params;
                await handlInitializeApp({ id: appId, source })
                    .then(() => Messenger.successResponse(id, true))
                    .catch(() =>
                        Messenger.errorResponse({
                            error: { message: 'Could not initialize app', code: -32001 },
                            id,
                        }),
                    );
                break;
            }
            default: {
                Messenger.errorResponse({
                    error: { message: 'Method not found', code: -32601 },
                    id,
                });
                break;
            }
        }
    }
}

main();
