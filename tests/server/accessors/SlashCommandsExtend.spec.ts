// tslint:disable:max-line-length

import { ISlashCommand } from '@rocket.chat/apps-ts-definition/slashcommands';
import { AsyncTest, Expect, Test } from 'alsatian';

import { SlashCommandsExtend } from '../../../src/server/accessors';
import { CommandAlreadyExistsError } from '../../../src/server/errors';
import { AppSlashCommandManager } from '../../../src/server/managers';

export class SlashCommandsExtendAccessorTestFixture {
    @Test()
    public basicSlashCommandsExtend() {
        Expect(() => new SlashCommandsExtend({} as AppSlashCommandManager, 'testing')).not.toThrow();
    }

    @AsyncTest()
    public async provideCommandToCommandsExtend(): Promise<void> {
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

        await Expect(async () => await se.provideSlashCommand(mockCommand)).not.toThrowAsync();
        Expect(commands.size).toBe(1);
        await Expect(async () => await se.provideSlashCommand(mockCommand)).toThrowErrorAsync(CommandAlreadyExistsError, 'The command "mock" already exists in the system.');
    }
}
