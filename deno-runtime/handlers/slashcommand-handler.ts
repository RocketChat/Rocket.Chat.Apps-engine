import { ISlashCommand } from '@rocket.chat/apps-engine/definition/slashcommands/ISlashCommand.ts';

import { AppObjectRegistry } from '../AppObjectRegistry.ts';
import { require } from '../lib/require.ts';
import { AppAccessors, AppAccessorsInstance } from '../lib/accessors/mod.ts';

// For some reason Deno couldn't understand the typecast to the original interfaces and said it wasn't a constructor type
// So we're rolling with `any` for now
const SlashCommandContext = require('@rocket.chat/apps-engine/definition/slashcommands/SlashCommandContext.js');
const Room = require('@rocket.chat/apps-engine/server/rooms/Room.js');

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

export default function slashCommandHandler(call: string, params: unknown[]) {
    const [, commandName, method] = call.split(':');

    const command = AppObjectRegistry.get<ISlashCommand>(`slashcommand:${commandName}`);

    if (!command) {
        throw new Error(`Slashcommand ${command} not found`, { cause: [1, 2, 3] });
    }

    if (method === 'executor' || method === 'previewer') {
        return handleExecutor({ AppAccessorsInstance }, command, method, params);
    }

    if (method === 'executePreviewItem') {
        return handlePreviewItem({ AppAccessorsInstance }, command, params);
    }

    throw new Error(`Method ${method} not found on slashcommand ${commandName}`);
}

/**
 * @param deps Dependencies that need to be injected into the slashcommand
 * @param command The slashcommand that is being executed
 * @param method The method that is being executed
 * @param params The parameters that are being passed to the method
 */
function handleExecutor(deps: { AppAccessorsInstance: AppAccessors }, command: ISlashCommand, method: 'executor' | 'previewer', params: unknown[]) {
    const executor = command[method];

    if (typeof executor !== 'function') {
        throw new Error(`Method ${method} not found on slashcommand ${command.command}`);
    }

    if (typeof params[0] !== 'object' || !params[0]) {
        throw new Error(`First parameter must be an object`);
    }

    const { sender, room, params: args, threadId, triggerId } = params[0] as Record<string, unknown>;

    const context = new SlashCommandContext(sender, new Room(room, getMockAppManager(deps.AppAccessorsInstance.getSenderFn())), args, threadId, triggerId);

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
function handlePreviewItem(deps: { AppAccessorsInstance: AppAccessors }, command: ISlashCommand, params: unknown[]) {
    if (typeof command.executePreviewItem !== 'function') {
        throw new Error(`Method  not found on slashcommand ${command.command}`);
    }

    if (typeof params[0] !== 'object' || !params[0]) {
        throw new Error(`First parameter must be an object`);
    }

    const [previewItem, { sender, room, params: args, threadId, triggerId }] = params as [Record<string, unknown>, Record<string, unknown>];

    const context = new SlashCommandContext(sender, new Room(room, getMockAppManager(deps.AppAccessorsInstance.getSenderFn())), args, threadId, triggerId);

    return command.executePreviewItem(
        previewItem,
        context,
        deps.AppAccessorsInstance.getReader(),
        deps.AppAccessorsInstance.getModifier(),
        deps.AppAccessorsInstance.getHttp(),
        deps.AppAccessorsInstance.getPersistence(),
    );
}
