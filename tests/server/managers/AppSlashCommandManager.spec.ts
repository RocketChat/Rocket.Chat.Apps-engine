// tslint:disable:max-line-length

import { AsyncTest, Expect, FunctionSpy, RestorableFunctionSpy, Setup, SetupFixture, SpyOn, Teardown, Test } from 'alsatian';
import * as vm from 'vm';
import { AppStatus } from '../../../src/definition/AppStatus';
import { AppMethod } from '../../../src/definition/metadata';
import { ISlashCommandPreviewItem, SlashCommandContext } from '../../../src/definition/slashcommands';
import { TestsAppBridges } from '../../test-data/bridges/appBridges';
import { TestsAppLogStorage } from '../../test-data/storage/logStorage';
import { TestData } from '../../test-data/utilities';

import { AppManager } from '../../../src/server/AppManager';
import { AppBridges } from '../../../src/server/bridges';
import { CommandAlreadyExistsError, CommandHasAlreadyBeenTouchedError } from '../../../src/server/errors';
import { AppConsole } from '../../../src/server/logging';
import { AppAccessorManager, AppApiManager, AppExternalComponentManager, AppSchedulerManager, AppSlashCommandManager } from '../../../src/server/managers';
import { AppSlashCommand } from '../../../src/server/managers/AppSlashCommand';
import { ProxiedApp } from '../../../src/server/ProxiedApp';
import { Room } from '../../../src/server/rooms/Room';
import { AppLogStorage } from '../../../src/server/storage';

export class AppSlashCommandManagerTestFixture {
    public static doThrow: boolean = false;
    private mockBridges: TestsAppBridges;
    private mockApp: ProxiedApp;
    private mockAccessors: AppAccessorManager;
    private mockManager: AppManager;
    private spies: Array<RestorableFunctionSpy>;

    @SetupFixture
    public setupFixture() {
        this.mockBridges = new TestsAppBridges();

        this.mockApp = {
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
                return AppSlashCommandManagerTestFixture.doThrow ?
                    Promise.reject('You told me so') : Promise.resolve();
            },
            setupLogger(method: AppMethod): AppConsole {
                return new AppConsole(method);
            },
        } as ProxiedApp;

        const bri = this.mockBridges;
        const app = this.mockApp;
        this.mockManager = {
            getBridges(): AppBridges {
                return bri;
            },
            getCommandManager() {
                return {} as AppSlashCommandManager;
            },
            getExternalComponentManager(): AppExternalComponentManager {
                return {} as AppExternalComponentManager;
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
            getSchedulerManager() {
                return {} as AppSchedulerManager;
            },
        } as AppManager;

        this.mockAccessors = new AppAccessorManager(this.mockManager);
        const ac = this.mockAccessors;
        this.mockManager.getAccessorManager = function _getAccessorManager(): AppAccessorManager {
            return ac;
        };
    }

    @Setup
    public setup() {
        this.mockBridges = new TestsAppBridges();
        const bri = this.mockBridges;
        this.mockManager.getBridges = function _refreshedGetBridges(): AppBridges {
            return bri;
        };

        this.spies = new Array<RestorableFunctionSpy>();
        this.spies.push(SpyOn(this.mockBridges.getCommandBridge(), 'doDoesCommandExist'));
        this.spies.push(SpyOn(this.mockBridges.getCommandBridge(), 'doRegisterCommand'));
        this.spies.push(SpyOn(this.mockBridges.getCommandBridge(), 'doUnregisterCommand'));
        this.spies.push(SpyOn(this.mockBridges.getCommandBridge(), 'doEnableCommand'));
        this.spies.push(SpyOn(this.mockBridges.getCommandBridge(), 'doDisableCommand'));
    }

    @Teardown
    public teardown() {
        this.spies.forEach((s) => s.restore());
    }

    @Test()
    public basicAppSlashCommandManager() {
        Expect(() => new AppSlashCommandManager({} as AppManager)).toThrow();
        Expect(() => new AppSlashCommandManager(this.mockManager)).not.toThrow();

        const ascm = new AppSlashCommandManager(this.mockManager);
        Expect((ascm as any).manager).toBe(this.mockManager);
        Expect((ascm as any).bridge).toBe(this.mockBridges.getCommandBridge());
        Expect((ascm as any).accessors).toBe(this.mockManager.getAccessorManager());
        Expect((ascm as any).providedCommands).toBeDefined();
        Expect((ascm as any).providedCommands.size).toBe(0);
        Expect((ascm as any).modifiedCommands).toBeDefined();
        Expect((ascm as any).modifiedCommands.size).toBe(0);
        Expect((ascm as any).touchedCommandsToApps).toBeDefined();
        Expect((ascm as any).touchedCommandsToApps.size).toBe(0);
        Expect((ascm as any).appsTouchedCommands).toBeDefined();
        Expect((ascm as any).appsTouchedCommands.size).toBe(0);
    }

    @Test()
    public canCommandBeTouchedBy() {
        const ascm = new AppSlashCommandManager(this.mockManager);

        Expect(ascm.canCommandBeTouchedBy('testing', 'command')).toBe(true);
        (ascm as any).touchedCommandsToApps.set('just-a-test', 'anotherAppId');
        Expect(ascm.canCommandBeTouchedBy('testing', 'just-a-test')).toBe(false);
    }

    @Test()
    public isAlreadyDefined() {
        const ascm = new AppSlashCommandManager(this.mockManager);

        const reg = new Map<string, AppSlashCommand>();
        reg.set('command', new AppSlashCommand(this.mockApp, TestData.getSlashCommand('command')));

        Expect(ascm.isAlreadyDefined('command')).toBe(false);
        (ascm as any).providedCommands.set('testing', reg);
        Expect(ascm.isAlreadyDefined('command')).toBe(true);
        Expect(ascm.isAlreadyDefined('cOMMand')).toBe(true);
        Expect(ascm.isAlreadyDefined(' command ')).toBe(true);
        Expect(ascm.isAlreadyDefined('c0mmand')).toBe(false);
    }

    @Test()
    public setAsTouched() {
        const ascm = new AppSlashCommandManager(this.mockManager);

        Expect(() => (ascm as any).setAsTouched('testing', 'command')).not.toThrow();
        Expect((ascm as any).appsTouchedCommands.has('testing')).toBe(true);
        Expect((ascm as any).appsTouchedCommands.get('testing') as Array<string>).not.toBeEmpty();
        Expect((ascm as any).appsTouchedCommands.get('testing').length).toBe(1);
        Expect((ascm as any).touchedCommandsToApps.has('command')).toBe(true);
        Expect((ascm as any).touchedCommandsToApps.get('command')).toBe('testing');
        Expect(() => (ascm as any).setAsTouched('testing', 'command')).not.toThrow();
        Expect((ascm as any).appsTouchedCommands.get('testing').length).toBe(1);
    }

    @Test()
    public registerCommand() {
        const ascm = new AppSlashCommandManager(this.mockManager);

        const regInfo = new AppSlashCommand(this.mockApp, TestData.getSlashCommand('command'));

        Expect(() => (ascm as any).registerCommand('testing', regInfo)).not.toThrow();
        Expect(this.mockBridges.getCommandBridge().doRegisterCommand).toHaveBeenCalledWith(regInfo.slashCommand, 'testing');
        Expect(regInfo.isRegistered).toBe(true);
        Expect(regInfo.isDisabled).toBe(false);
        Expect(regInfo.isEnabled).toBe(true);
    }

    @Test()
    public addCommand() {
        const cmd = TestData.getSlashCommand('my-cmd');
        const ascm = new AppSlashCommandManager(this.mockManager);

        Expect(() => ascm.addCommand('testing', cmd)).not.toThrow();
        Expect(this.mockBridges.getCommandBridge().commands.size).toBe(1);
        Expect((ascm as any).providedCommands.size).toBe(1);
        Expect((ascm as any).touchedCommandsToApps.get('my-cmd')).toBe('testing');
        Expect((ascm as any).appsTouchedCommands.get('testing').length).toBe(1);
        Expect(() => ascm.addCommand('another-app', cmd)).toThrowError(CommandHasAlreadyBeenTouchedError, 'The command "my-cmd" has already been touched by another App.');
        Expect(() => ascm.addCommand('testing', cmd)).toThrowError(CommandAlreadyExistsError, 'The command "my-cmd" already exists in the system.');
        Expect(() => ascm.addCommand('failMePlease', TestData.getSlashCommand('yet-another'))).toThrowError(Error, 'App must exist in order for a command to be added.');
        Expect(() => ascm.addCommand('testing', TestData.getSlashCommand('another-command'))).not.toThrow();
        Expect((ascm as any).providedCommands.size).toBe(1);
        Expect((ascm as any).providedCommands.get('testing').size).toBe(2);
        Expect(() => ascm.addCommand('even-another-app', TestData.getSlashCommand('it-exists'))).toThrowError(CommandAlreadyExistsError, 'The command "it-exists" already exists in the system.');
    }

    @Test()
    public failToModifyAnotherAppsCommand() {
        const ascm = new AppSlashCommandManager(this.mockManager);
        ascm.addCommand('other-app', TestData.getSlashCommand('my-cmd'));

        Expect(() => ascm.modifyCommand('testing', TestData.getSlashCommand('my-cmd'))).toThrowError(CommandHasAlreadyBeenTouchedError, 'The command "my-cmd" has already been touched by another App.');
    }

    @Test()
    public failToModifyNonExistantAppCommand() {
        const ascm = new AppSlashCommandManager(this.mockManager);

        Expect(() => ascm.modifyCommand('failMePlease', TestData.getSlashCommand('yet-another'))).toThrowError(Error, 'App must exist in order to modify a command.');
    }

    @Test()
    public modifyMyCommand() {
        const ascm = new AppSlashCommandManager(this.mockManager);

        Expect(() => ascm.modifyCommand('testing', TestData.getSlashCommand())).toThrowError(Error, 'You must first register a command before you can modify it.');
        ascm.addCommand('testing', TestData.getSlashCommand('the-cmd'));
        Expect(() => ascm.modifyCommand('testing', TestData.getSlashCommand('the-cmd'))).not.toThrow();
    }

    @Test()
    public modifySystemCommand() {
        const ascm = new AppSlashCommandManager(this.mockManager);

        Expect(() => ascm.modifyCommand('brand-new-id', TestData.getSlashCommand('it-exists'))).not.toThrow();
        Expect((ascm as any).modifiedCommands.size).toBe(1);
        Expect((ascm as any).modifiedCommands.get('it-exists')).toBeDefined();
        Expect((ascm as any).touchedCommandsToApps.get('it-exists')).toBe('brand-new-id');
    }

    @Test()
    public enableMyCommand() {
        const ascm = new AppSlashCommandManager(this.mockManager);

        Expect(() => ascm.enableCommand('testing', 'doesnt-exist')).toThrowError(Error, 'The command "doesnt-exist" does not exist to enable.');
        ascm.addCommand('testing', TestData.getSlashCommand('command'));
        Expect(() => ascm.enableCommand('testing', 'command')).not.toThrow();
        Expect((ascm as any).providedCommands.get('testing').get('command').isDisabled).toBe(false);
        Expect((ascm as any).providedCommands.get('testing').get('command').isEnabled).toBe(true);
        ascm.addCommand('testing', TestData.getSlashCommand('another-command'));
        (ascm as any).providedCommands.get('testing').get('another-command').isRegistered = true;
        Expect(() => ascm.enableCommand('testing', 'another-command')).not.toThrow();
        Expect(this.mockBridges.getCommandBridge().doDoesCommandExist).toHaveBeenCalled().exactly(3);
    }

    @Test()
    public enableSystemCommand() {
        const ascm = new AppSlashCommandManager(this.mockManager);

        Expect(() => ascm.enableCommand('testing', 'it-exists')).not.toThrow();
        Expect(this.mockBridges.getCommandBridge().doEnableCommand).toHaveBeenCalledWith('it-exists', 'testing').exactly(1);
        Expect(this.mockBridges.getCommandBridge().doDoesCommandExist).toHaveBeenCalled().exactly(1);
    }

    @Test()
    public failToEnableAnotherAppsCommand() {
        const ascm = new AppSlashCommandManager(this.mockManager);
        ascm.addCommand('another-app', TestData.getSlashCommand('command'));

        Expect(() => ascm.enableCommand('my-app', 'command')).toThrowError(CommandHasAlreadyBeenTouchedError, 'The command "command" has already been touched by another App.');
    }

    @Test()
    public disableMyCommand() {
        const ascm = new AppSlashCommandManager(this.mockManager);

        Expect(() => ascm.disableCommand('testing', 'doesnt-exist')).toThrowError(Error, 'The command "doesnt-exist" does not exist to disable.');
        ascm.addCommand('testing', TestData.getSlashCommand('command'));
        Expect(() => ascm.disableCommand('testing', 'command')).not.toThrow();
        Expect((ascm as any).providedCommands.get('testing').get('command').isDisabled).toBe(true);
        Expect((ascm as any).providedCommands.get('testing').get('command').isEnabled).toBe(false);
        ascm.addCommand('testing', TestData.getSlashCommand('another-command'));
        (ascm as any).providedCommands.get('testing').get('another-command').isRegistered = true;
        Expect(() => ascm.disableCommand('testing', 'another-command')).not.toThrow();
        Expect(this.mockBridges.getCommandBridge().doDoesCommandExist).toHaveBeenCalled().exactly(3);
    }

    @Test()
    public disableSystemCommand() {
        const ascm = new AppSlashCommandManager(this.mockManager);

        Expect(() => ascm.disableCommand('testing', 'it-exists')).not.toThrow();
        Expect(this.mockBridges.getCommandBridge().doDisableCommand).toHaveBeenCalledWith('it-exists', 'testing').exactly(1);
        Expect(this.mockBridges.getCommandBridge().doDoesCommandExist).toHaveBeenCalled().exactly(1);
    }

    @Test()
    public failToDisableAnotherAppsCommand() {
        const ascm = new AppSlashCommandManager(this.mockManager);
        ascm.addCommand('another-app', TestData.getSlashCommand('command'));

        Expect(() => ascm.disableCommand('my-app', 'command')).toThrowError(CommandHasAlreadyBeenTouchedError, 'The command "command" has already been touched by another App.');
    }

    @Test()
    public registerCommands() {
        const ascm = new AppSlashCommandManager(this.mockManager);

        SpyOn(ascm, 'registerCommand');

        ascm.addCommand('testing', TestData.getSlashCommand('enabled-command'));
        const enabledRegInfo = (ascm as any).providedCommands.get('testing').get('enabled-command') as AppSlashCommand;
        ascm.addCommand('testing', TestData.getSlashCommand('disabled-command'));
        ascm.disableCommand('testing', 'disabled-command');
        const disabledRegInfo = (ascm as any).providedCommands.get('testing').get('disabled-command') as AppSlashCommand;

        Expect(() => ascm.registerCommands('non-existant')).not.toThrow();
        Expect(() => ascm.registerCommands('testing')).not.toThrow();
        Expect(enabledRegInfo.isRegistered).toBe(true);
        Expect(disabledRegInfo.isRegistered).toBe(false);
        Expect((ascm as any).registerCommand as FunctionSpy).toHaveBeenCalledWith('testing', enabledRegInfo).exactly(1);
        Expect(this.mockBridges.getCommandBridge().doRegisterCommand).toHaveBeenCalledWith(enabledRegInfo.slashCommand, 'testing').exactly(1);
    }

    @Test()
    public unregisterCommands() {
        const ascm = new AppSlashCommandManager(this.mockManager);

        ascm.addCommand('testing', TestData.getSlashCommand('command'));
        ascm.modifyCommand('testing', TestData.getSlashCommand('it-exists'));

        Expect(() => ascm.unregisterCommands('non-existant')).not.toThrow();
        Expect(() => ascm.unregisterCommands('testing')).not.toThrow();
        Expect(this.mockBridges.getCommandBridge().doUnregisterCommand).toHaveBeenCalled().exactly(1);
    }

    @AsyncTest()
    public async executeCommands() {
        const ascm = new AppSlashCommandManager(this.mockManager);
        ascm.addCommand('testing', TestData.getSlashCommand('command'));
        ascm.addCommand('testing', TestData.getSlashCommand('not-registered'));
        ascm.addCommand('testing', TestData.getSlashCommand('disabled-command'));
        ascm.disableCommand('testing', 'not-registered');
        ascm.registerCommands('testing');
        (ascm as any).providedCommands.get('testing').get('disabled-command').isDisabled = true;
        ascm.modifyCommand('testing', TestData.getSlashCommand('it-exists'));

        const context = new SlashCommandContext(TestData.getUser(), TestData.getRoom(), []);
        SpyOn(this.mockApp, 'runInContext');

        await Expect(async () => await ascm.executeCommand('nope', context)).not.toThrowAsync();
        await Expect(async () => await ascm.executeCommand('it-exists', context)).not.toThrowAsync();
        await Expect(async () => await ascm.executeCommand('command', context)).not.toThrowAsync();
        await Expect(async () => await ascm.executeCommand('not-registered', context)).not.toThrowAsync();
        await Expect(async () => await ascm.executeCommand('disabled-command', context)).not.toThrowAsync();

        const classContext = new SlashCommandContext(TestData.getUser(), new Room(TestData.getRoom(), this.mockManager), []);
        await Expect(async () => await ascm.executeCommand('it-exists', classContext)).not.toThrowAsync();

        // set it up for no "no app failure"
        const failedItems = new Map<string, AppSlashCommand>();
        const asm = new AppSlashCommand(this.mockApp, TestData.getSlashCommand('failure'));
        asm.hasBeenRegistered();
        failedItems.set('failure', asm);
        (ascm as any).providedCommands.set('failMePlease', failedItems);
        (ascm as any).touchedCommandsToApps.set('failure', 'failMePlease');
        await Expect(async () => await ascm.executeCommand('failure', context)).not.toThrowAsync();

        AppSlashCommandManagerTestFixture.doThrow = true;
        await Expect(async () => await ascm.executeCommand('command', context)).not.toThrowAsync();
        AppSlashCommandManagerTestFixture.doThrow = false;

        Expect(this.mockApp.runInContext).toHaveBeenCalled().exactly(4);
    }

    @AsyncTest()
    public async getPreviews() {
        const ascm = new AppSlashCommandManager(this.mockManager);
        ascm.addCommand('testing', TestData.getSlashCommand('command'));
        ascm.addCommand('testing', TestData.getSlashCommand('not-registered'));
        ascm.addCommand('testing', TestData.getSlashCommand('disabled-command'));
        ascm.disableCommand('testing', 'not-registered');
        ascm.registerCommands('testing');
        (ascm as any).providedCommands.get('testing').get('disabled-command').isDisabled = true;
        ascm.modifyCommand('testing', TestData.getSlashCommand('it-exists'));

        const context = new SlashCommandContext(TestData.getUser(), TestData.getRoom(), ['testing']);

        await Expect(async () => await ascm.getPreviews('nope', context)).not.toThrowAsync();
        await Expect(async () => await ascm.getPreviews('it-exists', context)).not.toThrowAsync();
        await Expect(async () => await ascm.getPreviews('command', context)).not.toThrowAsync();
        await Expect(async () => await ascm.getPreviews('not-registered', context)).not.toThrowAsync();
        await Expect(async () => await ascm.getPreviews('disabled-command', context)).not.toThrowAsync();

        const classContext = new SlashCommandContext(TestData.getUser(), new Room(TestData.getRoom(), this.mockManager), []);
        await Expect(async () => await ascm.getPreviews('it-exists', classContext)).not.toThrowAsync();

        // set it up for no "no app failure"
        const failedItems = new Map<string, AppSlashCommand>();
        const asm = new AppSlashCommand(this.mockApp, TestData.getSlashCommand('failure'));
        asm.hasBeenRegistered();
        failedItems.set('failure', asm);
        (ascm as any).providedCommands.set('failMePlease', failedItems);
        (ascm as any).touchedCommandsToApps.set('failure', 'failMePlease');
        await Expect(async () => await ascm.getPreviews('failure', context)).not.toThrowAsync();

        // TODO: Figure out how tests can mock/test the result now that we care about it
    }

    @AsyncTest()
    public async executePreview() {
        const previewItem = {} as ISlashCommandPreviewItem;
        const ascm = new AppSlashCommandManager(this.mockManager);
        ascm.addCommand('testing', TestData.getSlashCommand('command'));
        ascm.addCommand('testing', TestData.getSlashCommand('not-registered'));
        ascm.addCommand('testing', TestData.getSlashCommand('disabled-command'));
        ascm.disableCommand('testing', 'not-registered');
        ascm.registerCommands('testing');
        (ascm as any).providedCommands.get('testing').get('disabled-command').isDisabled = true;
        ascm.modifyCommand('testing', TestData.getSlashCommand('it-exists'));

        const context = new SlashCommandContext(TestData.getUser(), TestData.getRoom(), ['testing']);

        await Expect(async () => await ascm.executePreview('nope', previewItem, context)).not.toThrowAsync();
        await Expect(async () => await ascm.executePreview('it-exists', previewItem, context)).not.toThrowAsync();
        await Expect(async () => await ascm.executePreview('command', previewItem, context)).not.toThrowAsync();
        await Expect(async () => await ascm.executePreview('not-registered', previewItem, context)).not.toThrowAsync();
        await Expect(async () => await ascm.executePreview('disabled-command', previewItem, context)).not.toThrowAsync();

        const classContext = new SlashCommandContext(TestData.getUser(), new Room(TestData.getRoom(), this.mockManager), []);
        await Expect(async () => await ascm.executePreview('it-exists', previewItem, classContext)).not.toThrowAsync();

        // set it up for no "no app failure"
        const failedItems = new Map<string, AppSlashCommand>();
        const asm = new AppSlashCommand(this.mockApp, TestData.getSlashCommand('failure'));
        asm.hasBeenRegistered();
        failedItems.set('failure', asm);
        (ascm as any).providedCommands.set('failMePlease', failedItems);
        (ascm as any).touchedCommandsToApps.set('failure', 'failMePlease');
        await Expect(async () => await ascm.executePreview('failure', previewItem, context)).not.toThrowAsync();
    }
}
