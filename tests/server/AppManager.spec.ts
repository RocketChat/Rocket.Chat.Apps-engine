// tslint:disable:max-line-length
import { Expect, SetupFixture, Teardown, Test } from 'alsatian';
import { SimpleClass, TestInfastructureSetup } from '../test-data/utilities';

import { AppManager } from '../../src/server/AppManager';
import { AppBridges } from '../../src/server/bridges';
import { AppCompiler, AppPackageParser } from '../../src/server/compiler';
import { AppAccessorManager, AppApiManager, AppExternalComponentManager, AppListenerManager, AppSettingsManager, AppSlashCommandManager } from '../../src/server/managers';
import { AppLogStorage, AppStorage } from '../../src/server/storage';

export class AppManagerTestFixture {
    private testingInfastructure: TestInfastructureSetup;

    @SetupFixture
    public setupFixture() {
        this.testingInfastructure = new TestInfastructureSetup();
    }

    @Teardown
    public teardown() {
        AppManager.Instance = undefined;
    }

    @Test('Setup of the AppManager')
    public setupAppManager() {
        const manager = new AppManager(this.testingInfastructure.getAppStorage(), this.testingInfastructure.getLogStorage(), this.testingInfastructure.getAppBridges());

        Expect(manager.getStorage()).toBe(this.testingInfastructure.getAppStorage());
        Expect(manager.getLogStorage()).toBe(this.testingInfastructure.getLogStorage());
        // NOTE: manager.getBridges() returns a proxy, so they are vlaue equality instead of reference equality
        Expect(manager.getBridges()).toEqual(this.testingInfastructure.getAppBridges());
        Expect(manager.areAppsLoaded()).toBe(false);

        Expect(() => new AppManager({} as AppStorage, {} as AppLogStorage, {} as AppBridges)).toThrowError(Error, 'There is already a valid AppManager instance.');
    }

    @Test('Invalid Storage and Bridge')
    public invalidInstancesPassed() {
        const invalid = new SimpleClass();
        Expect(() => new AppManager(invalid as any, invalid as any, invalid as any)).toThrowError(Error, 'Invalid instance of the AppStorage.');
        Expect(() => new AppManager(this.testingInfastructure.getAppStorage(), invalid as any, invalid as any)).toThrowError(Error, 'Invalid instance of the AppLogStorage.');
        Expect(() => new AppManager(this.testingInfastructure.getAppStorage(), this.testingInfastructure.getLogStorage(), invalid as any)).toThrowError(Error, 'Invalid instance of the AppBridges');
    }

    @Test('Ensure Managers are Valid Types')
    public verifyManagers() {
        const manager = new AppManager(this.testingInfastructure.getAppStorage(), this.testingInfastructure.getLogStorage(), this.testingInfastructure.getAppBridges());

        Expect(manager.getParser() instanceof AppPackageParser).toBe(true);
        Expect(manager.getCompiler() instanceof AppCompiler).toBe(true);
        Expect(manager.getAccessorManager() instanceof AppAccessorManager).toBe(true);
        Expect(manager.getBridges() instanceof AppBridges).toBe(true);
        Expect(manager.getListenerManager() instanceof AppListenerManager).toBe(true);
        Expect(manager.getCommandManager() instanceof AppSlashCommandManager).toBe(true);
        Expect(manager.getExternalComponentManager() instanceof AppExternalComponentManager).toBe(true);
        Expect(manager.getApiManager() instanceof AppApiManager).toBe(true);
        Expect(manager.getSettingsManager() instanceof AppSettingsManager).toBe(true);
    }
}
