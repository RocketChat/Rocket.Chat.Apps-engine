import { Defined, JsonRpcError } from 'jsonrpc-lite';
import type { App } from '@rocket.chat/apps-engine/definition/App.ts';
import type { IMessage } from '@rocket.chat/apps-engine/definition/messages/IMessage.ts';
import type { IRoom } from '@rocket.chat/apps-engine/definition/rooms/IRoom.ts';
import type { AppsEngineException as _AppsEngineException } from '@rocket.chat/apps-engine/definition/exceptions/AppsEngineException.ts';

import { AppObjectRegistry } from '../../AppObjectRegistry.ts';
import { MessageExtender } from '../../lib/accessors/extenders/MessageExtender.ts';
import { RoomExtender } from '../../lib/accessors/extenders/RoomExtender.ts';
import { MessageBuilder } from '../../lib/accessors/builders/MessageBuilder.ts';
import { RoomBuilder } from '../../lib/accessors/builders/RoomBuilder.ts';
import { AppAccessors, AppAccessorsInstance } from '../../lib/accessors/mod.ts';
import { require } from '../../lib/require.ts';
import createRoom from '../../lib/roomFactory.ts';

const { AppsEngineException } = require('@rocket.chat/apps-engine/definition/exceptions/AppsEngineException.js') as {
    AppsEngineException: typeof _AppsEngineException;
};

export default async function handleListener(evtInterface: string, params: unknown): Promise<Defined | JsonRpcError> {
    const app = AppObjectRegistry.get<App>('app');

    const eventExecutor = app?.[evtInterface as keyof App];

    if (typeof eventExecutor !== 'function') {
        return JsonRpcError.methodNotFound({
            message: 'Invalid event interface called on app',
        });
    }

    if (!Array.isArray(params) || params.length < 1 || params.length > 2) {
        return JsonRpcError.invalidParams(null);
    }

    try {
        const args = parseArgs({ AppAccessorsInstance }, evtInterface, params);
        return await (eventExecutor as (...args: unknown[]) => Promise<Defined>).apply(app, args);
    } catch (e) {
        if (e instanceof JsonRpcError) {
            return e;
        }

        if (e instanceof AppsEngineException) {
            return new JsonRpcError(e.message, AppsEngineException.JSONRPC_ERROR_CODE, { name: e.name });
        }

        return JsonRpcError.internalError({ message: e.message });
    }
}

export function parseArgs(deps: { AppAccessorsInstance: AppAccessors }, evtMethod: string, params: unknown[]): unknown[] {
    const { AppAccessorsInstance } = deps;
    /**
     * param1 is the context for the event handler execution
     * param2 is an optional extra content that some hanlers require
     */
    const [param1, param2] = params as [unknown, unknown];

    if (!param1) {
        throw JsonRpcError.invalidParams(null);
    }

    let context = param1;

    if (evtMethod.endsWith('RoomUserJoined') || evtMethod.endsWith('RoomUserLeave')) {
        (context as Record<string, unknown>).room = createRoom((context as Record<string, unknown>).room as IRoom, AppAccessorsInstance.getSenderFn());
    } else if (evtMethod.includes('PreRoom')) {
        context = createRoom(context as IRoom, AppAccessorsInstance.getSenderFn());
    }

    const args: unknown[] = [context, AppAccessorsInstance.getReader(), AppAccessorsInstance.getHttp()];

    // "check" events will only go this far - (context, reader, http)
    if (evtMethod.startsWith('check')) {
        // "checkPostMessageDeleted" has an extra param - (context, reader, http, extraContext)
        if (param2) {
            args.push(param2);
        }

        return args;
    }

    // From this point on, all events will require (reader, http, persistence) injected
    args.push(AppAccessorsInstance.getPersistence());

    // "extend" events have an additional "Extender" param - (context, extender, reader, http, persistence)
    if (evtMethod.endsWith('Extend')) {
        if (evtMethod.includes('Message')) {
            args.splice(1, 0, new MessageExtender(param1 as IMessage));
        } else if (evtMethod.includes('Room')) {
            args.splice(1, 0, new RoomExtender(param1 as IRoom));
        }

        return args;
    }

    // "Modify" events have an additional "Builder" param - (context, builder, reader, http, persistence)
    if (evtMethod.endsWith('Modify')) {
        if (evtMethod.includes('Message')) {
            args.splice(1, 0, new MessageBuilder(param1 as IMessage));
        } else if (evtMethod.includes('Room')) {
            args.splice(1, 0, new RoomBuilder(param1 as IRoom));
        }

        return args;
    }

    // From this point on, all events will require (reader, http, persistence, modifier) injected
    args.push(AppAccessorsInstance.getModifier());

    // This guy gets an extra one
    if (evtMethod === 'executePostMessageDeleted') {
        if (!param2) {
            throw JsonRpcError.invalidParams(null);
        }

        args.push(param2);
    }

    return args;
}
