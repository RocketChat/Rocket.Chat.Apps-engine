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
import type { App } from "@rocket.chat/apps-engine/definition/App.ts";

import * as Messenger from './lib/messenger.ts';
import { AppObjectRegistry } from './AppObjectRegistry.ts';
import { Logger } from './lib/logger.ts';

import slashcommandHandler from './handlers/slashcommand-handler.ts';
import videoConferenceHandler from './handlers/videoconference-handler.ts';
import apiHandler from './handlers/api-handler.ts'
import handleApp from './handlers/app/handler.ts';
import handleScheduler from "./handlers/scheduler-handler.ts";

const MESSAGE_SEPARATOR = Deno.args.at(-1) || '\n';

AppObjectRegistry.set('MESSAGE_SEPARATOR', MESSAGE_SEPARATOR);

type Handlers = {
    'app': typeof handleApp,
    'api': typeof apiHandler,
    'slashcommand': typeof slashcommandHandler
    'videoconference': typeof videoConferenceHandler
    'scheduler': typeof handleScheduler,
}

async function requestRouter({ type, payload }: Messenger.JsonRpcRequest): Promise<void> {
    const methodHandlers: Handlers = {
        'app': handleApp,
        'api': apiHandler,
        'slashcommand': slashcommandHandler,
        'videoconference': videoConferenceHandler,
        'scheduler': handleScheduler,
    }

    // We're not handling notifications at the moment
    if (type === 'notification') {
        return Messenger.sendInvalidRequestError();
    }

    const { id, method, params } = payload;

    const logger = new Logger(method);
    AppObjectRegistry.set('logger', logger);

    const app = AppObjectRegistry.get<App>('app');

    if (app) {
        // Same logic as applied in the ProxiedApp class previously
        (app as unknown as Record<string, unknown>).logger = logger;
    }

    const [methodPrefix] = method.split(':') as [keyof Handlers];
    const handler = methodHandlers[methodPrefix]

    if (!handler) {
       return Messenger.errorResponse({
            error: { message: 'Method not found', code: -32601 },
            id,
        });
    }

    const result = await handler(method, params);

    if (result instanceof JsonRpcError) {
        return Messenger.errorResponse({ id, error: result });
    }

    return Messenger.successResponse({ id, result });
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

    let messageBuffer = '';

    for await (const chunk of Deno.stdin.readable) {
        const message = decoder.decode(chunk);

        messageBuffer += message;

        if (!message?.endsWith(MESSAGE_SEPARATOR)) {
            continue;
        }

        let JSONRPCMessage;

        try {
            JSONRPCMessage = Messenger.parseMessage(messageBuffer.replace(MESSAGE_SEPARATOR, ''));
        } catch (error) {
            if (Messenger.isErrorResponse(error)) {
                await Messenger.Transport.send(error);
            } else {
                await Messenger.sendParseError();
            }

            continue;
        } finally {
            messageBuffer = '';
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
