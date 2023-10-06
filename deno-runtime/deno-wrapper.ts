if (!Deno.args.includes('--subprocess')) {
    Deno.stderr.writeSync(
        new TextEncoder().encode(`
            This is a Deno wrapper for Rocket.Chat Apps. It is not meant to be executed stand-alone;
            It is instead meant to be executed as a subprocess by the Apps-Engine framework.
       `),
    );
    Deno.exit(1001);
}

import { createRequire } from 'node:module';
import { sanitizeDeprecatedUsage } from "./lib/sanitizeDeprecatedUsage.ts";

const require = createRequire(import.meta.url);

// @deno-types='../definition/App.d.ts'
const { App } = require('../definition/App');

async function notifyEngine(notify: Record<string, unknown>): Promise<void> {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(JSON.stringify(notify));
    await Deno.stdout.write(encoded);
    return undefined;
}

const ALLOWED_NATIVE_MODULES = ['path', 'url', 'crypto', 'buffer', 'stream', 'net', 'http', 'https', 'zlib', 'util', 'punycode', 'os', 'querystring'];
const ALLOWED_EXTERNAL_MODULES = ['uuid'];

function buildRequire(): (module: string) => unknown {
    return (module: string): unknown => {
        if (ALLOWED_NATIVE_MODULES.includes(module)) {
            return require(`node:${module}`)
        }

        if (ALLOWED_EXTERNAL_MODULES.includes(module)) {
            return require(`npm:${module}`);
        }

        if (module.startsWith('@rocket.chat/apps-engine')) {
            const path = module.replace('@rocket.chat/apps-engine/', new URL('..', import.meta.url).pathname).concat('.js');
            return require(path);
        }

        throw new Error(`Module ${module} is not allowed`);
    };
}

function wrapAppCode(code: string): (require: (module: string) => unknown) => Promise<Record<string, unknown>> {
    return new Function(
        'require',
        `
        const exports = {};
        const module = { exports };
        const result = (async (exports,module,require,globalThis,Deno) => {
            ${code};
        })(exports,module,require);
        return result.then(() => module.exports);`,
    ) as (require: (module: string) => unknown) => Promise<Record<string, unknown>>;
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

function proxify(namespace: string) {
    return new Proxy({}, {
        get(target: unknown, prop: string): unknown {
            return (...args: unknown[]) => {
                return {};
            };
        }
    })
}

async function handlInitializeApp({ id, source }: { id: string; source: string }): Promise<Record<string, unknown>> {
    source = sanitizeDeprecatedUsage(source);
    const require = buildRequire();
    const exports = await wrapAppCode(source)(require);
    // This is the same naive logic we've been using in the App Compiler
    const appClass = Object.values(exports)[0] as typeof App;
    const app = new appClass({ author: {} }, proxify('logger'), proxify('AppAccessors'));

    if (typeof app.getName !== 'function') {
        throw new MustContainFunctionError(storage.info.classFile, 'getName');
    }

    if (typeof app.getNameSlug !== 'function') {
        throw new MustContainFunctionError(storage.info.classFile, 'getNameSlug');
    }

    if (typeof app.getVersion !== 'function') {
        throw new MustContainFunctionError(storage.info.classFile, 'getVersion');
    }

    if (typeof app.getID !== 'function') {
        throw new MustContainFunctionError(storage.info.classFile, 'getID');
    }

    if (typeof app.getDescription !== 'function') {
        throw new MustContainFunctionError(storage.info.classFile, 'getDescription');
    }

    if (typeof app.getRequiredApiVersion !== 'function') {
        throw new MustContainFunctionError(storage.info.classFile, 'getRequiredApiVersion');
    }

    return app;
}

async function main() {
    setTimeout(() => notifyEngine({ method: 'ready', _data: Deno.inspect(App) }), 1_780);

    const decoder = new TextDecoder();
    let app: typeof App;

    for await (const chunk of Deno.stdin.readable) {
        const message = decoder.decode(chunk);
        const { method, params, id } = JSON.parse(message);

        switch (method) {
            case 'construct': {
                const [appId, source] = params;
                app = await handlInitializeApp({ id: appId, source })
                Messenger.successResponse(id, { result: "hooray!" });
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
