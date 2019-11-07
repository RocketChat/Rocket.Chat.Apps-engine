import { ISlashCommand } from '../../../src/definition/slashcommands';

import { SlashCommandsModify } from '../../../src/server/accessors';
import { AppSlashCommandManager } from '../../../src/server/managers';
import { TestData } from '../../test-data/utilities';

let cmd: ISlashCommand;
let mockAppId: string;
let mockCmdManager: AppSlashCommandManager;

beforeAll(() =>  {
    cmd = TestData.getSlashCommand();
    mockAppId = 'testing-app';
    mockCmdManager = {
        modifyCommand(appId: string, command: ISlashCommand): void {
            return;
        },
        disableCommand(appId: string, command: string): void {
            return;
        },
        enableCommand(appId: string, command: string): void {
            return;
        },
    } as AppSlashCommandManager;
});

test('useSlashCommandsModify', async () => {
    expect(() => new SlashCommandsModify(mockCmdManager, mockAppId)).not.toThrow();

    const sp1 = jest.spyOn(mockCmdManager, 'modifyCommand');
    const sp2 = jest.spyOn(mockCmdManager, 'disableCommand');
    const sp3 = jest.spyOn(mockCmdManager, 'enableCommand');

    const scm = new SlashCommandsModify(mockCmdManager, mockAppId);

    expect(await scm.modifySlashCommand(cmd)).not.toBeDefined();
    expect(mockCmdManager.modifyCommand).toHaveBeenCalledWith(mockAppId, cmd);
    expect(await scm.disableSlashCommand('testing-cmd')).not.toBeDefined();
    expect(mockCmdManager.disableCommand).toHaveBeenCalledWith(mockAppId, 'testing-cmd');
    expect(await scm.enableSlashCommand('testing-cmd')).not.toBeDefined();
    expect(mockCmdManager.enableCommand).toHaveBeenCalledWith(mockAppId, 'testing-cmd');

    sp1.mockClear();
    sp2.mockClear();
    sp3.mockClear();
});
