import { ISlashCommand } from '../../../src/definition/slashcommands';

import { SlashCommandsExtend } from '../../../src/server/accessors';
import { CommandAlreadyExistsError } from '../../../src/server/errors';
import { AppSlashCommandManager } from '../../../src/server/managers';

test('basicSlashCommandsExtend', () => {
    expect(() => new SlashCommandsExtend({} as AppSlashCommandManager, 'testing')).not.toThrow();
});

test('provideCommandToCommandsExtend', async (): Promise<void> => {
    const commands = new Map<string, Array<ISlashCommand>>();
    const mockManager: AppSlashCommandManager = {
        addCommand(appId: string, command: ISlashCommand) {
            if (commands.has(appId)) {
                const cmds = commands.get(appId);
                if (cmds.find((v) => v.command === command.command)) {
                    throw new CommandAlreadyExistsError(command.command);
                }

                cmds.push(command);
                return;
            }

            commands.set(appId, Array.from([command]));
        },
    } as AppSlashCommandManager;

    const se = new SlashCommandsExtend(mockManager, 'testing');

    const mockCommand: ISlashCommand = {
        command: 'mock',
        i18nDescription: 'Thing',
    } as ISlashCommand;

    await expect(() => se.provideSlashCommand(mockCommand)).not.toThrow();
    expect(commands.size).toBe(1);
    await expect(() => se.provideSlashCommand(mockCommand)).toThrowError(new CommandAlreadyExistsError(mockCommand.command));
});
