import vm from 'vm';
import { AppStatus } from '../../../src/definition/AppStatus';
import { AppMethod } from '../../../src/definition/metadata';
import { ISlashCommandPreviewItem, SlashCommandContext } from '../../../src/definition/slashcommands';
import { TestsAppBridges } from '../../test-data/bridges/appBridges';
import { TestsAppLogStorage } from '../../test-data/logStorage';
import { TestData } from '../../test-data/utilities';

import { AppManager } from '../../../src/server/AppManager';
import { AppBridges } from '../../../src/server/bridges';
import { CommandAlreadyExistsError, CommandHasAlreadyBeenTouchedError } from '../../../src/server/errors';
import { AppConsole } from '../../../src/server/logging';
import { AppAccessorManager, AppApiManager, AppSlashCommandManager } from '../../../src/server/managers';
import { AppSlashCommand } from '../../../src/server/managers/AppSlashCommand';
import { ProxiedApp } from '../../../src/server/ProxiedApp';
import { Room } from '../../../src/server/rooms/Room';
import { AppLogStorage } from '../../../src/server/storage';

let doThrow: boolean = false;
let mockBridges: TestsAppBridges;
let mockApp: ProxiedApp;
let mockAccessors: AppAccessorManager;
let mockManager: AppManager;
let spies: Array<jest.SpyInstance>;

beforeAll(() =>  {
    mockBridges = new TestsAppBridges();

    mockApp = {
        getID() {
            return 'testing';
        },
        getStatus() {
            return AppStatus.AUTO_ENABLED;
        },
        hasMethod(method: AppMethod): boolean {
            return true;
        },
        makeContext(data: object): vm.Context {
            return {} as vm.Context;
        },
        runInContext(codeToRun: string, context: vm.Context): any {
            return doThrow ?
                Promise.reject('You told me so') : Promise.resolve();
        },
        setupLogger(method: AppMethod): AppConsole {
            return new AppConsole(method);
        },
    } as ProxiedApp;

    const bri = mockBridges;
    const app = mockApp;
    mockManager = {
        getBridges(): AppBridges {
            return bri;
        },
        getCommandManager() {
            return {} as AppSlashCommandManager;
        },
        getApiManager() {
            return {} as AppApiManager;
        },
        getOneById(appId: string): ProxiedApp {
            return appId === 'failMePlease' ? undefined : app;
        },
        getLogStorage(): AppLogStorage {
            return new TestsAppLogStorage();
        },
    } as AppManager;

    mockAccessors = new AppAccessorManager(mockManager);
    const ac = mockAccessors;
    mockManager.getAccessorManager = function _getAccessorManager(): AppAccessorManager {
        return ac;
    };
});

beforeEach(() => {
    mockBridges = new TestsAppBridges();
    const bri = mockBridges;
    mockManager.getBridges = function _refreshedGetBridges(): AppBridges {
        return bri;
    };

    spies = new Array<jest.SpyInstance>();
    spies.push(jest.spyOn(mockBridges.getCommandBridge(), 'doesCommandExist'));
    spies.push(jest.spyOn(mockBridges.getCommandBridge(), 'registerCommand'));
    spies.push(jest.spyOn(mockBridges.getCommandBridge(), 'unregisterCommand'));
    spies.push(jest.spyOn(mockBridges.getCommandBridge(), 'restoreCommand'));
    spies.push(jest.spyOn(mockBridges.getCommandBridge(), 'enableCommand'));
    spies.push(jest.spyOn(mockBridges.getCommandBridge(), 'disableCommand'));
});

afterEach(() => {
    spies.forEach((s) => s.mockClear());
});

test('basicAppSlashCommandManager', () => {
    expect(() => new AppSlashCommandManager({} as AppManager)).toThrow();
    expect(() => new AppSlashCommandManager(mockManager)).not.toThrow();

    const ascm = new AppSlashCommandManager(mockManager);
    expect((ascm as any).manager).toBe(mockManager);
    expect((ascm as any).bridge).toBe(mockBridges.getCommandBridge());
    expect((ascm as any).accessors).toBe(mockManager.getAccessorManager());
    expect((ascm as any).providedCommands).toBeDefined();
    expect((ascm as any).providedCommands.size).toBe(0);
    expect((ascm as any).modifiedCommands).toBeDefined();
    expect((ascm as any).modifiedCommands.size).toBe(0);
    expect((ascm as any).touchedCommandsToApps).toBeDefined();
    expect((ascm as any).touchedCommandsToApps.size).toBe(0);
    expect((ascm as any).appsTouchedCommands).toBeDefined();
    expect((ascm as any).appsTouchedCommands.size).toBe(0);
});

test('canCommandBeTouchedBy', () => {
    const ascm = new AppSlashCommandManager(mockManager);

    expect(ascm.canCommandBeTouchedBy('testing', 'command')).toBe(true);
    (ascm as any).touchedCommandsToApps.set('just-a-test', 'anotherAppId');
    expect(ascm.canCommandBeTouchedBy('testing', 'just-a-test')).toBe(false);
});

test('isAlreadyDefined', () => {
    const ascm = new AppSlashCommandManager(mockManager);

    const reg = new Map<string, AppSlashCommand>();
    reg.set('command', new AppSlashCommand(mockApp, TestData.getSlashCommand('command')));

    expect(ascm.isAlreadyDefined('command')).toBe(false);
    (ascm as any).providedCommands.set('testing', reg);
    expect(ascm.isAlreadyDefined('command')).toBe(true);
    expect(ascm.isAlreadyDefined('cOMMand')).toBe(true);
    expect(ascm.isAlreadyDefined(' command ')).toBe(true);
    expect(ascm.isAlreadyDefined('c0mmand')).toBe(false);
});

test('setAsTouched', () => {
    const ascm = new AppSlashCommandManager(mockManager);

    expect(() => (ascm as any).setAsTouched('testing', 'command')).not.toThrow();
    expect((ascm as any).appsTouchedCommands.has('testing')).toBe(true);
    expect((ascm as any).appsTouchedCommands.get('testing') as Array<string>).not.toBeEmpty();
    expect((ascm as any).appsTouchedCommands.get('testing').length).toBe(1);
    expect((ascm as any).touchedCommandsToApps.has('command')).toBe(true);
    expect((ascm as any).touchedCommandsToApps.get('command')).toBe('testing');
    expect(() => (ascm as any).setAsTouched('testing', 'command')).not.toThrow();
    expect((ascm as any).appsTouchedCommands.get('testing').length).toBe(1);
});

test('registerCommand', () => {
    const ascm = new AppSlashCommandManager(mockManager);

    const regInfo = new AppSlashCommand(mockApp, TestData.getSlashCommand('command'));

    expect(() => (ascm as any).registerCommand('testing', regInfo)).not.toThrow();
    expect(mockBridges.getCommandBridge().registerCommand).toHaveBeenCalledWith(regInfo.slashCommand, 'testing');
    expect(regInfo.isRegistered).toBe(true);
    expect(regInfo.isDisabled).toBe(false);
    expect(regInfo.isEnabled).toBe(true);
});

test('addCommand', () => {
    const cmd = TestData.getSlashCommand('my-cmd');
    const ascm = new AppSlashCommandManager(mockManager);

    expect(() => ascm.addCommand('testing', cmd)).not.toThrow();
    expect(mockBridges.getCommandBridge().commands.size).toBe(1);
    expect((ascm as any).providedCommands.size).toBe(1);
    expect((ascm as any).touchedCommandsToApps.get('my-cmd')).toBe('testing');
    expect((ascm as any).appsTouchedCommands.get('testing').length).toBe(1);
    expect(() => ascm.addCommand('another-app', cmd)).toThrowError(new CommandHasAlreadyBeenTouchedError('my-cmd'));
    expect(() => ascm.addCommand('testing', cmd)).toThrowError(new CommandAlreadyExistsError('my-cmd'));
    expect(() => ascm.addCommand('failMePlease', TestData.getSlashCommand('yet-another'))).toThrowError('App must exist in order for a command to be added.');
    expect(() => ascm.addCommand('testing', TestData.getSlashCommand('another-command'))).not.toThrow();
    expect((ascm as any).providedCommands.size).toBe(1);
    expect((ascm as any).providedCommands.get('testing').size).toBe(2);
    expect(() => ascm.addCommand('even-another-app', TestData.getSlashCommand('it-exists'))).toThrowError(new CommandAlreadyExistsError('it-exists'));
});
test('failToModifyAnotherAppsCommand', () => {
    const ascm = new AppSlashCommandManager(mockManager);
    ascm.addCommand('other-app', TestData.getSlashCommand('my-cmd'));

    expect(() => ascm.modifyCommand('testing', TestData.getSlashCommand('my-cmd'))).toThrowError(new CommandHasAlreadyBeenTouchedError('my-cmd'));
});

test('failToModifyNonExistantAppCommand', () => {
    const ascm = new AppSlashCommandManager(mockManager);

    expect(() => ascm.modifyCommand('failMePlease', TestData.getSlashCommand('yet-another'))).toThrowError('App must exist in order to modify a command.');
});

test('modifyMyCommand', () => {
    const ascm = new AppSlashCommandManager(mockManager);

    expect(() => ascm.modifyCommand('testing', TestData.getSlashCommand())).toThrowError('You must first register a command before you can modify it.');
    ascm.addCommand('testing', TestData.getSlashCommand('the-cmd'));
    expect(() => ascm.modifyCommand('testing', TestData.getSlashCommand('the-cmd'))).not.toThrow();
});

test('modifySystemCommand', () => {
    const ascm = new AppSlashCommandManager(mockManager);

    expect(() => ascm.modifyCommand('brand-new-id', TestData.getSlashCommand('it-exists'))).not.toThrow();
    expect((ascm as any).modifiedCommands.size).toBe(1);
    expect((ascm as any).modifiedCommands.get('it-exists')).toBeDefined();
    expect((ascm as any).touchedCommandsToApps.get('it-exists')).toBe('brand-new-id');
});

test('enableMyCommand', () => {
    const ascm = new AppSlashCommandManager(mockManager);

    expect(() => ascm.enableCommand('testing', 'doesnt-exist')).toThrowError('The command "doesnt-exist" does not exist to enable.');
    ascm.addCommand('testing', TestData.getSlashCommand('command'));
    expect(() => ascm.enableCommand('testing', 'command')).not.toThrow();
    expect((ascm as any).providedCommands.get('testing').get('command').isDisabled).toBe(false);
    expect((ascm as any).providedCommands.get('testing').get('command').isEnabled).toBe(true);
    ascm.addCommand('testing', TestData.getSlashCommand('another-command'));
    (ascm as any).providedCommands.get('testing').get('another-command').isRegistered = true;
    expect(() => ascm.enableCommand('testing', 'another-command')).not.toThrow();
    expect(mockBridges.getCommandBridge().doesCommandExist).toHaveReturnedTimes(3);
});

test('enableSystemCommand', () => {
    const ascm = new AppSlashCommandManager(mockManager);

    expect(() => ascm.enableCommand('testing', 'it-exists')).not.toThrow();
    expect(mockBridges.getCommandBridge().enableCommand).toHaveBeenCalledWith('it-exists', 'testing');
    expect(mockBridges.getCommandBridge().enableCommand).toHaveReturnedTimes(1);
    expect(mockBridges.getCommandBridge().doesCommandExist).toHaveBeenCalledTimes(1);
});

test('failToEnableAnotherAppsCommand', () => {
    const ascm = new AppSlashCommandManager(mockManager);
    ascm.addCommand('another-app', TestData.getSlashCommand('command'));

    expect(() => ascm.enableCommand('my-app', 'command')).toThrowError(new CommandHasAlreadyBeenTouchedError('command'));
});

test('disableMyCommand', () => {
    const ascm = new AppSlashCommandManager(mockManager);

    expect(() => ascm.disableCommand('testing', 'doesnt-exist')).toThrowError('The command "doesnt-exist" does not exist to disable.');
    ascm.addCommand('testing', TestData.getSlashCommand('command'));
    expect(() => ascm.disableCommand('testing', 'command')).not.toThrow();
    expect((ascm as any).providedCommands.get('testing').get('command').isDisabled).toBe(true);
    expect((ascm as any).providedCommands.get('testing').get('command').isEnabled).toBe(false);
    ascm.addCommand('testing', TestData.getSlashCommand('another-command'));
    (ascm as any).providedCommands.get('testing').get('another-command').isRegistered = true;
    expect(() => ascm.disableCommand('testing', 'another-command')).not.toThrow();
    expect(mockBridges.getCommandBridge().doesCommandExist).toHaveBeenCalledTimes(3);
});

test('disableSystemCommand', () => {
    const ascm = new AppSlashCommandManager(mockManager);

    expect(() => ascm.disableCommand('testing', 'it-exists')).not.toThrow();
    expect(mockBridges.getCommandBridge().disableCommand).toHaveBeenCalledWith('it-exists', 'testing');
    expect(mockBridges.getCommandBridge().disableCommand).toHaveBeenCalledTimes(1);
    expect(mockBridges.getCommandBridge().doesCommandExist).toHaveBeenCalledTimes(1);
});

test('failToDisableAnotherAppsCommand', () => {
    const ascm = new AppSlashCommandManager(mockManager);
    ascm.addCommand('another-app', TestData.getSlashCommand('command'));

    expect(() => ascm.disableCommand('my-app', 'command')).toThrowError(new CommandHasAlreadyBeenTouchedError('command'));
});

test('registerCommands', () => {
    const ascm = new AppSlashCommandManager(mockManager);

    jest.spyOn<any, string>(ascm, 'registerCommand');

    ascm.addCommand('testing', TestData.getSlashCommand('enabled-command'));
    const enabledRegInfo = (ascm as any).providedCommands.get('testing').get('enabled-command') as AppSlashCommand;
    ascm.addCommand('testing', TestData.getSlashCommand('disabled-command'));
    ascm.disableCommand('testing', 'disabled-command');
    const disabledRegInfo = (ascm as any).providedCommands.get('testing').get('disabled-command') as AppSlashCommand;

    expect(() => ascm.registerCommands('non-existant')).not.toThrow();
    expect(() => ascm.registerCommands('testing')).not.toThrow();
    expect(enabledRegInfo.isRegistered).toBe(true);
    expect(disabledRegInfo.isRegistered).toBe(false);

    expect((ascm as any).registerCommand).toHaveBeenCalledWith('testing', enabledRegInfo);
    expect((ascm as any).registerCommand).toHaveBeenCalledTimes(1);

    expect(mockBridges.getCommandBridge().registerCommand).toHaveBeenCalledWith(enabledRegInfo.slashCommand, 'testing');
    expect(mockBridges.getCommandBridge().registerCommand).toHaveBeenCalledTimes(1);
});

test('unregisterCommands', () => {
    const ascm = new AppSlashCommandManager(mockManager);

    ascm.addCommand('testing', TestData.getSlashCommand('command'));
    ascm.modifyCommand('testing', TestData.getSlashCommand('it-exists'));

    expect(() => ascm.unregisterCommands('non-existant')).not.toThrow();
    expect(() => ascm.unregisterCommands('testing')).not.toThrow();
    expect(mockBridges.getCommandBridge().unregisterCommand).toHaveBeenCalledTimes(1);
    expect(mockBridges.getCommandBridge().restoreCommand).toHaveBeenCalledWith('it-exists', 'testing');
    expect(mockBridges.getCommandBridge().restoreCommand).toHaveBeenCalledTimes(1);
});

test('executeCommands', async () => {
    const ascm = new AppSlashCommandManager(mockManager);
    ascm.addCommand('testing', TestData.getSlashCommand('command'));
    ascm.addCommand('testing', TestData.getSlashCommand('not-registered'));
    ascm.addCommand('testing', TestData.getSlashCommand('disabled-command'));
    ascm.disableCommand('testing', 'not-registered');
    ascm.registerCommands('testing');
    (ascm as any).providedCommands.get('testing').get('disabled-command').isDisabled = true;
    ascm.modifyCommand('testing', TestData.getSlashCommand('it-exists'));

    const context = new SlashCommandContext(TestData.getUser(), TestData.getRoom(), []);
    jest.spyOn(mockApp, 'runInContext');

    await expect(async () => await ascm.executeCommand('nope', context)).not.toThrow();
    await expect(async () => await ascm.executeCommand('it-exists', context)).not.toThrow();
    await expect(async () => await ascm.executeCommand('command', context)).not.toThrow();
    await expect(async () => await ascm.executeCommand('not-registered', context)).not.toThrow();
    await expect(async () => await ascm.executeCommand('disabled-command', context)).not.toThrow();

    const classContext = new SlashCommandContext(TestData.getUser(), new Room(TestData.getRoom(), mockManager), []);
    await expect(async () => await ascm.executeCommand('it-exists', classContext)).not.toThrow();

    // set it up for no "no app failure"
    const failedItems = new Map<string, AppSlashCommand>();
    const asm = new AppSlashCommand(mockApp, TestData.getSlashCommand('failure'));
    asm.hasBeenRegistered();
    failedItems.set('failure', asm);
    (ascm as any).providedCommands.set('failMePlease', failedItems);
    (ascm as any).touchedCommandsToApps.set('failure', 'failMePlease');
    await expect(async () => await ascm.executeCommand('failure', context)).not.toThrow();
    doThrow = true;
    await expect(async () => await ascm.executeCommand('command', context)).not.toThrow();
    doThrow = false;

    expect(mockApp.runInContext).toHaveBeenCalledTimes(4);
});

test('getPreviews', async () => {
    const ascm = new AppSlashCommandManager(mockManager);
    ascm.addCommand('testing', TestData.getSlashCommand('command'));
    ascm.addCommand('testing', TestData.getSlashCommand('not-registered'));
    ascm.addCommand('testing', TestData.getSlashCommand('disabled-command'));
    ascm.disableCommand('testing', 'not-registered');
    ascm.registerCommands('testing');
    (ascm as any).providedCommands.get('testing').get('disabled-command').isDisabled = true;
    ascm.modifyCommand('testing', TestData.getSlashCommand('it-exists'));

    const context = new SlashCommandContext(TestData.getUser(), TestData.getRoom(), ['testing']);

    await expect(async () => await ascm.getPreviews('nope', context)).not.toThrow();
    await expect(async () => await ascm.getPreviews('it-exists', context)).not.toThrow();
    await expect(async () => await ascm.getPreviews('command', context)).not.toThrow();
    await expect(async () => await ascm.getPreviews('not-registered', context)).not.toThrow();
    await expect(async () => await ascm.getPreviews('disabled-command', context)).not.toThrow();

    const classContext = new SlashCommandContext(TestData.getUser(), new Room(TestData.getRoom(), mockManager), []);
    await expect(async () => await ascm.getPreviews('it-exists', classContext)).not.toThrow();

    // set it up for no "no app failure"
    const failedItems = new Map<string, AppSlashCommand>();
    const asm = new AppSlashCommand(mockApp, TestData.getSlashCommand('failure'));
    asm.hasBeenRegistered();
    failedItems.set('failure', asm);
    (ascm as any).providedCommands.set('failMePlease', failedItems);
    (ascm as any).touchedCommandsToApps.set('failure', 'failMePlease');
    await expect(async () => await ascm.getPreviews('failure', context)).not.toThrow();

    // TODO: Figure out how tests can mock/test the result now that we care about it
});

test('executePreview', async () => {
    const previewItem = {} as ISlashCommandPreviewItem;
    const ascm = new AppSlashCommandManager(mockManager);
    ascm.addCommand('testing', TestData.getSlashCommand('command'));
    ascm.addCommand('testing', TestData.getSlashCommand('not-registered'));
    ascm.addCommand('testing', TestData.getSlashCommand('disabled-command'));
    ascm.disableCommand('testing', 'not-registered');
    ascm.registerCommands('testing');
    (ascm as any).providedCommands.get('testing').get('disabled-command').isDisabled = true;
    ascm.modifyCommand('testing', TestData.getSlashCommand('it-exists'));

    const context = new SlashCommandContext(TestData.getUser(), TestData.getRoom(), ['testing']);

    await expect(async () => await ascm.executePreview('nope', previewItem, context)).not.toThrow();
    await expect(async () => await ascm.executePreview('it-exists', previewItem, context)).not.toThrow();
    await expect(async () => await ascm.executePreview('command', previewItem, context)).not.toThrow();
    await expect(async () => await ascm.executePreview('not-registered', previewItem, context)).not.toThrow();
    await expect(async () => await ascm.executePreview('disabled-command', previewItem, context)).not.toThrow();

    const classContext = new SlashCommandContext(TestData.getUser(), new Room(TestData.getRoom(), mockManager), []);
    await expect(async () => await ascm.executePreview('it-exists', previewItem, classContext)).not.toThrow();

    // set it up for no "no app failure"
    const failedItems = new Map<string, AppSlashCommand>();
    const asm = new AppSlashCommand(mockApp, TestData.getSlashCommand('failure'));
    asm.hasBeenRegistered();
    failedItems.set('failure', asm);
    (ascm as any).providedCommands.set('failMePlease', failedItems);
    (ascm as any).touchedCommandsToApps.set('failure', 'failMePlease');
    await expect(async () => await ascm.executePreview('failure', previewItem, context)).not.toThrow();
});
