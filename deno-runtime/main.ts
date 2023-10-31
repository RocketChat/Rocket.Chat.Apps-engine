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
import { proxify } from "./lib/accessors/mod.ts";
import * as Messenger from "./lib/messenger.ts";

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

async function handlInitializeApp({ id, source }: { id: string; source: string }): Promise<Record<string, unknown>> {
    source = sanitizeDeprecatedUsage(source);
    const require = buildRequire();
    const exports = await wrapAppCode(source)(require);
    // This is the same naive logic we've been using in the App Compiler
    const appClass = Object.values(exports)[0] as typeof App;
    const app = new appClass({ author: {} }, proxify('logger'), proxify('AppAccessors'));

    if (typeof app.getName !== 'function') {
        throw new Error('App must contain a getName function');
    }

    if (typeof app.getNameSlug !== 'function') {
        throw new Error('App must contain a getNameSlug function');
    }

    if (typeof app.getVersion !== 'function') {
        throw new Error('App must contain a getVersion function');
    }

    if (typeof app.getID !== 'function') {
        throw new Error('App must contain a getID function');
    }

    if (typeof app.getDescription !== 'function') {
        throw new Error('App must contain a getDescription function');
    }

    if (typeof app.getRequiredApiVersion !== 'function') {
        throw new Error('App must contain a getRequiredApiVersion function');
    }

    return app;
}

async function handleRequest({ method, params, id }: Messenger.Request): Promise<void> {
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

async function handleResponse(response: Messenger.Response): Promise<void> {
    let event: Event;

    if (Messenger.isErrorResponse(response)) {
        event = new ErrorEvent(`response:${response.id}`, { error: response.error });
    } else {
        event = new CustomEvent(`response:${response.id}`, { detail: response.result });
    }

    Messenger.RPCResponseObserver.dispatchEvent(event);
}

async function main() {
    setTimeout(() => notifyEngine({ method: 'ready' }), 1_780);

    const decoder = new TextDecoder();
    let app: typeof App;

    for await (const chunk of Deno.stdin.readable) {
        const message = decoder.decode(chunk);
        let JSONRPCMessage

        try {
            JSONRPCMessage = JSON.parse(message);
        } catch (_) {
            return Messenger.serverParseError();
        }

        if (Messenger.isRequest(JSONRPCMessage)) {
            await handleRequest(JSONRPCMessage);
        }

        if (Messenger.isResponse(JSONRPCMessage)) {
            await handleResponse(JSONRPCMessage);
        }
    }
}

main();
