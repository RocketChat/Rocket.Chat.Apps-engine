import { Defined, JsonRpcError } from 'jsonrpc-lite';
import type { App } from '@rocket.chat/apps-engine/definition/App.ts';

import { AppObjectRegistry } from '../../AppObjectRegistry.ts';
import { MessageExtender } from "../../lib/accessors/extenders/MessageExtender.ts";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages/IMessage.ts";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms/IRoom.ts";
import { RoomExtender } from "../../lib/accessors/extenders/RoomExtender.ts";
import { MessageBuilder } from "../../lib/accessors/builders/MessageBuilder.ts";
import { RoomBuilder } from "../../lib/accessors/builders/RoomBuilder.ts";
import { AppAccessorsInstance } from "../../lib/accessors/mod.ts";

export default async function handleListener(method: string, params: unknown): Promise<Defined | JsonRpcError> {
    const [, evtInterface] = method.split(':');

    const app = AppObjectRegistry.get<App>('app');

    const eventExecutor = app?.[evtInterface as keyof App];

    if (typeof eventExecutor !== 'function') {
        return new JsonRpcError('Invalid event interface called on app', -32000);
    }

    if (!Array.isArray(params) || params.length < 1 || params.length > 2) {
        return new JsonRpcError('Invalid params', -32602);
    }

    try {
        const args = parseArgs(evtInterface, params);
        return await (eventExecutor as Function).apply(app, args);
    } catch (e) {
        if (e instanceof JsonRpcError) {
            return e;
        }

        return JsonRpcError.internalError(e.message);
    }
}

function parseArgs(evtInterface: string, params: unknown[]): unknown[] {
    /**
     * param1 is the context for the event handler execution
     * param2 is an optional extra content that some hanlers require
     */
    const [param1, param2] = params as [unknown, unknown];

    if (!param1) {
        throw new JsonRpcError('Invalid params', -32000);
    }

    const args: unknown[] = [param1, AppAccessorsInstance.getReader(), AppAccessorsInstance.getHttp()];

    // "check" events will only go this far - (context, reader, http)
    if (evtInterface.startsWith('check')) {
        // "checkPostMessageDeleted" has an extra param - (context, reader, http, extraContext)
        if (param2) {
            args.push(param2);
        }

        return args;
    }

    // From this point on, all events will require (reader, http, persistence) injected
    args.push(AppAccessorsInstance.getPersistence());

    // "extend" events have an additional "Extender" param - (context, extender, reader, http, persistence)
    if (evtInterface.endsWith('Extend')) {
        if (evtInterface.includes('Message')) {
            args.splice(1, 0, new MessageExtender(param1 as IMessage));
        } else if (evtInterface.includes('Room')) {
            args.splice(1, 0, new RoomExtender(param1 as IRoom));
        }

        return args;
    }

    // "Modify" events have an additional "Builder" param - (context, builder, reader, http, persistence)
    if (evtInterface.endsWith('Modify')) {
        if (evtInterface.includes('Message')) {
            args.splice(1, 0, new MessageBuilder(param1 as IMessage));
        } else if (evtInterface.includes('Room')) {
            args.splice(1, 0, new RoomBuilder(param1 as IRoom));
        }

        return args;
    }

    // From this point on, all events will require (reader, http, persistence, modifier) injected
    args.push(AppAccessorsInstance.getModifier());

    // This guy gets an extra one
    if (evtInterface === 'executePostMessageDeleted') {
        if (!param2) {
            throw new JsonRpcError('Invalid params', -32000);
        }

        args.push(param2);
    }

    return args;
}
