import { ISlashCommand } from '@rocket.chat/apps-engine/definition/slashcommands/ISlashCommand.ts';
import { SlashCommandContext as _SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands/SlashCommandContext.ts';
import { Room as _Room } from '@rocket.chat/apps-engine/server/rooms/Room.ts';

import { AppObjectRegistry } from '../AppObjectRegistry.ts';
import { require } from '../lib/require.ts';
import { AppAccessors, AppAccessorsInstance } from '../lib/accessors/mod.ts';
import { Defined, JsonRpcError } from "jsonrpc-lite";

// For some reason Deno couldn't understand the typecast to the original interfaces and said it wasn't a constructor type
const { SlashCommandContext } = require('@rocket.chat/apps-engine/definition/slashcommands/SlashCommandContext.js') as { SlashCommandContext: typeof _SlashCommandContext };
const { Room } = require('@rocket.chat/apps-engine/server/rooms/Room.js') as { Room: typeof _Room } ;

const getMockAppManager = (senderFn: AppAccessors['senderFn']) => ({
    getBridges: () => ({
        getInternalBridge: () => ({
            doGetUsernamesOfRoomById: (roomId: string) => {
                senderFn({
                    method: 'bridges:getInternalBridge:doGetUsernamesOfRoomById',
                    params: [roomId],
                });
            },
        }),
    }),
});

export default async function slashCommandHandler(call: string, params: unknown): Promise<JsonRpcError | Defined> {
    const [, commandName, method] = call.split(':');

    const command = AppObjectRegistry.get<ISlashCommand>(`slashcommand:${commandName}`);

    if (!command) {
        return new JsonRpcError(`Slashcommand ${commandName} not found`, -32000);
    }

    let result: Awaited<ReturnType<typeof handleExecutor>> | Awaited<ReturnType<typeof handlePreviewItem>>;

    try {
        if (method === 'executor' || method === 'previewer') {
            result = await handleExecutor({ AppAccessorsInstance }, command, method, params);
        } else if (method === 'executePreviewItem') {
            result = await handlePreviewItem({ AppAccessorsInstance }, command, params);
        } else {
            return new JsonRpcError(`Method ${method} not found on slashcommand ${commandName}`, -32000);
        }
    } catch (error) {
        return new JsonRpcError(error.message, -32000);
    }

    return result;
}

/**
 * @param deps Dependencies that need to be injected into the slashcommand
 * @param command The slashcommand that is being executed
 * @param method The method that is being executed
 * @param params The parameters that are being passed to the method
 */
export function handleExecutor(deps: { AppAccessorsInstance: AppAccessors }, command: ISlashCommand, method: 'executor' | 'previewer', params: unknown) {
    const executor = command[method];

    if (typeof executor !== 'function') {
        throw new Error(`Method ${method} not found on slashcommand ${command.command}`);
    }

    if (!Array.isArray(params) || typeof params[0] !== 'object' || !params[0]) {
        throw new Error(`First parameter must be an object`);
    }

    const { sender, room, params: args, threadId, triggerId } = params[0] as Record<string, unknown>;

    const context = new SlashCommandContext(
        sender as _SlashCommandContext['sender'],
        new Room(room, getMockAppManager(deps.AppAccessorsInstance.getSenderFn())),
        args as _SlashCommandContext['params'],
        threadId as _SlashCommandContext['threadId'],
        triggerId as _SlashCommandContext['triggerId'],
    );

    return executor.apply(command, [
        context,
        deps.AppAccessorsInstance.getReader(),
        deps.AppAccessorsInstance.getModifier(),
        deps.AppAccessorsInstance.getHttp(),
        deps.AppAccessorsInstance.getPersistence(),
    ]);
}

/**
 * @param deps Dependencies that need to be injected into the slashcommand
 * @param command The slashcommand that is being executed
 * @param params The parameters that are being passed to the method
 */
export function handlePreviewItem(deps: { AppAccessorsInstance: AppAccessors }, command: ISlashCommand, params: unknown) {
    if (typeof command.executePreviewItem !== 'function') {
        throw new Error(`Method  not found on slashcommand ${command.command}`);
    }

    if (!Array.isArray(params) || typeof params[0] !== 'object' || !params[0]) {
        throw new Error(`First parameter must be an object`);
    }

    const [previewItem, { sender, room, params: args, threadId, triggerId }] = params as [Record<string, unknown>, Record<string, unknown>];

    const context = new SlashCommandContext(
        sender as _SlashCommandContext['sender'],
        new Room(room, getMockAppManager(deps.AppAccessorsInstance.getSenderFn())),
        args as _SlashCommandContext['params'],
        threadId as _SlashCommandContext['threadId'],
        triggerId as _SlashCommandContext['triggerId'],
    );

    return command.executePreviewItem(
        previewItem,
        context,
        deps.AppAccessorsInstance.getReader(),
        deps.AppAccessorsInstance.getModifier(),
        deps.AppAccessorsInstance.getHttp(),
        deps.AppAccessorsInstance.getPersistence(),
    );
}
