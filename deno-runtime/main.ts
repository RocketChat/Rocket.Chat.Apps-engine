if (!Deno.args.includes('--subprocess')) {
    Deno.stderr.writeSync(
        new TextEncoder().encode(`
            This is a Deno wrapper for Rocket.Chat Apps. It is not meant to be executed stand-alone;
            It is instead meant to be executed as a subprocess by the Apps-Engine framework.
       `),
    );
    Deno.exit(1001);
}

import { JsonRpcError } from 'jsonrpc-lite';

import * as Messenger from './lib/messenger.ts';
import { AppObjectRegistry } from './AppObjectRegistry.ts';
import { Logger } from './lib/logger.ts';

import slashcommandHandler from './handlers/slashcommand-handler.ts';
import videoConferenceHandler from './handlers/videoconference-handler.ts';
import handleApp from './handlers/app/handler.ts';

AppObjectRegistry.set('MESSAGE_SEPARATOR', Deno.args.at(-1));

async function requestRouter({ type, payload }: Messenger.JsonRpcRequest): Promise<void> {
    // We're not handling notifications at the moment
    if (type === 'notification') {
        return Messenger.sendInvalidRequestError();
    }

    const { id, method, params } = payload;

    const logger = new Logger(method);
    AppObjectRegistry.set('logger', logger);

    switch (true) {
        case method.startsWith('app:'): {
            const result = await handleApp(method, params);

            if (result instanceof JsonRpcError) {
                return Messenger.errorResponse({ id, error: result });
            }

            Messenger.successResponse({ id, result });
            break;
        }
        case method.startsWith('slashcommand:'): {
            const result = await slashcommandHandler(method, params);

            if (result instanceof JsonRpcError) {
                return Messenger.errorResponse({ id, error: result });
            }

            return Messenger.successResponse({ id, result });
        }
        case method.startsWith('videoconference:'): {
            const result = await videoConferenceHandler(method, params);

            if (result instanceof JsonRpcError) {
                return Messenger.errorResponse({ id, error: result });
            }

            return Messenger.successResponse({ id, result });
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

function handleResponse(response: Messenger.JsonRpcResponse): void {
    let event: Event;

    if (response.type === 'error') {
        event = new ErrorEvent(`response:${response.payload.id}`, {
            error: response.payload.error,
        });
    } else {
        event = new CustomEvent(`response:${response.payload.id}`, {
            detail: response.payload.result,
        });
    }

    Messenger.RPCResponseObserver.dispatchEvent(event);
}

async function main() {
    Messenger.sendNotification({ method: 'ready' });

    const decoder = new TextDecoder();

    for await (const chunk of Deno.stdin.readable) {
        const message = decoder.decode(chunk);

        let JSONRPCMessage;

        try {
            JSONRPCMessage = Messenger.parseMessage(message);
        } catch (error) {
            if (Messenger.isErrorResponse(error)) {
                await Messenger.Transport.send(error);
            } else {
                await Messenger.sendParseError();
            }

            continue;
        }

        if (Messenger.isRequest(JSONRPCMessage)) {
            await requestRouter(JSONRPCMessage);
        }

        if (Messenger.isResponse(JSONRPCMessage)) {
            handleResponse(JSONRPCMessage);
        }
    }
}

main();
