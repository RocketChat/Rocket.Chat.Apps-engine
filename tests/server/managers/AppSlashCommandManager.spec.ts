// tslint:disable:max-line-length

import { Expect, RestorableFunctionSpy, Setup, SetupFixture, SpyOn, Teardown, Test } from 'alsatian';
import { TestsAppBridges } from '../../test-data/bridges/appBridges';
import { TestData } from '../../test-data/utilities';

import { AppManager } from '../../../src/server/AppManager';
import { AppBridges } from '../../../src/server/bridges';
import { CommandAlreadyExistsError } from '../../../src/server/errors';
import { AppAccessorManager, AppSlashCommandManager } from '../../../src/server/managers';
import { AppSlashCommandRegistration } from '../../../src/server/managers/AppSlashCommandRegistration';

export class AppSlashCommandManagerTestFixture {
    private mockBridges: TestsAppBridges;
    private mockAccessors: AppAccessorManager;
    private mockManager: AppManager;
    private spies: Array<RestorableFunctionSpy>;

    @SetupFixture
    public setupFixture() {
        this.mockBridges = new TestsAppBridges();

        const bri = this.mockBridges;
        this.mockManager = {
            getBridges(): AppBridges {
                return bri;
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
        this.spies = new Array<RestorableFunctionSpy>();
        this.spies.push(SpyOn(this.mockBridges.getCommandBridge(), 'doesCommandExist'));
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
        Expect((ascm as any).rlCommands).toBeDefined();
        Expect((ascm as any).rlCommands.size).toBe(0);
        Expect((ascm as any).registeredCommands).toBeDefined();
        Expect((ascm as any).registeredCommands.size).toBe(0);
        Expect((ascm as any).modifiedCommands).toBeDefined();
        Expect((ascm as any).modifiedCommands.size).toBe(0);
        Expect((ascm as any).commandMappingToApp).toBeDefined();
        Expect((ascm as any).commandMappingToApp.size).toBe(0);
    }

    @Test()
    public addCommand() {
        const cmd = TestData.getSlashCommand('my-cmd');
        const ascm = new AppSlashCommandManager(this.mockManager);

        Expect(() => ascm.addCommand('testing', cmd)).not.toThrow();
        Expect(this.mockBridges.getCommandBridge().commands.size).toBe(1); // Our testing bridge starts with one
        Expect((ascm as any).rlCommands.size).toBe(1);
        Expect(() => ascm.addCommand('testing', cmd)).toThrowError(CommandAlreadyExistsError, 'The command "my-cmd" already exists in the system.');
        Expect(() => ascm.addCommand('testing', TestData.getSlashCommand())).not.toThrow();
        Expect((ascm as any).rlCommands.size).toBe(1);
        Expect((ascm as any).rlCommands.get('testing').size).toBe(2);
        Expect(() => ascm.addCommand('brand-new', TestData.getSlashCommand('it-exists'))).toThrowError(CommandAlreadyExistsError, 'The command "it-exists" already exists in the system.');
    }

    @Test()
    public failToModifyAnotherAppsCommand() {
        const ascm = new AppSlashCommandManager(this.mockManager);

        const anotherApps = new Map<string, AppSlashCommandRegistration>();
        anotherApps.set('my-cmd', new AppSlashCommandRegistration(TestData.getSlashCommand('my-cmd')));
        (ascm as any).rlCommands.set('my-app-id', anotherApps);

        Expect(() => ascm.modifyCommand('testing', TestData.getSlashCommand('my-cmd'))).toThrowError(Error, 'You can not modify a command registered (or modified) by another App.');
    }

    @Test()
    public modifyMyCommand() {
        const ascm = new AppSlashCommandManager(this.mockManager);

        Expect(() => ascm.modifyCommand('testing', TestData.getSlashCommand())).toThrowError(Error, 'You must first register a command before you can modify it.');
        (ascm as any).rlCommands.set('testing', new Map<string, AppSlashCommandRegistration>());
        (ascm as any).rlCommands.get('testing').set('the-cmd', new AppSlashCommandRegistration(TestData.getSlashCommand('the-cmd')));
        Expect(() => ascm.modifyCommand('testing', TestData.getSlashCommand('the-cmd'))).not.toThrow();
        Expect((ascm as any).commandMappingToApp.size).toBe(1);
        Expect((ascm as any).commandMappingToApp.get('the-cmd')).toBe('testing');
    }

    @Test()
    public modifySystemCommand() {
        const ascm = new AppSlashCommandManager(this.mockManager);

        Expect(() => ascm.modifyCommand('brand-new-id', TestData.getSlashCommand('it-exists'))).not.toThrow();
        Expect((ascm as any).modifiedCommands.size).toBe(1);
        Expect((ascm as any).modifiedCommands.get('it-exists')).toBeDefined();
        Expect((ascm as any).commandMappingToApp.size).toBe(1);
        Expect((ascm as any).commandMappingToApp.get('it-exists')).toBe('brand-new-id');
    }

    @Test()
    public enableMyCommand() {
        const ascm = new AppSlashCommandManager(this.mockManager);

        Expect(() => ascm.enableCommand('testing', 'doesnt-exist')).toThrowError(Error, 'The command "doesnt-exist" does not exist to enable.');
        (ascm as any).rlCommands.set('testing', new Map<string, AppSlashCommandRegistration>());
        (ascm as any).rlCommands.get('testing').set('the-cmd', new AppSlashCommandRegistration(TestData.getSlashCommand('the-cmd')));
        Expect(() => ascm.enableCommand('testing', 'the-cmd')).not.toThrow();
        (ascm as any).rlCommands.get('testing').get('the-cmd').isRegistered = true;
        Expect(() => ascm.enableCommand('testing', 'the-cmd')).not.toThrow();
        Expect(() => ascm.enableCommand('testing', 'it-exists')).not.toThrow();
    }
}
