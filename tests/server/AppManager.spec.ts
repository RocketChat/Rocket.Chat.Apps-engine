import { SimpleClass, TestInfastructureSetup } from '../test-data/utilities';

import { AppManager } from '../../src/server/AppManager';
import { AppBridges } from '../../src/server/bridges';
import { AppCompiler, AppPackageParser } from '../../src/server/compiler';
import {
    AppAccessorManager,
    AppApiManager,
    AppListenerManager,
    AppSettingsManager,
    AppSlashCommandManager,
} from '../../src/server/managers';
import { AppLogStorage, AppStorage } from '../../src/server/storage';

let testingInfastructure: TestInfastructureSetup = null;

beforeAll(() => {
    testingInfastructure = new TestInfastructureSetup();
});

afterEach(() => {
    AppManager.Instance = undefined;
});

test('Setup of the AppManager', () => {
    const manager = new AppManager(
        testingInfastructure.getAppStorage(),
        testingInfastructure.getLogStorage(),
        testingInfastructure.getAppBridges(),
    );

    expect(manager.getStorage()).toBe(testingInfastructure.getAppStorage());
    expect(manager.getLogStorage()).toBe(testingInfastructure.getLogStorage());
    expect(manager.getBridges()).toBe(testingInfastructure.getAppBridges());
    expect(manager.areAppsLoaded()).toBe(false);

    expect(() => new AppManager({} as AppStorage, {} as AppLogStorage, {} as AppBridges)).toThrowError('There is already a valid AppManager instance.');
});

test('Invalid Storage and Bridge', () => {
    const invalid = new SimpleClass();
    expect(() => new AppManager(invalid as any, invalid as any, invalid as any)).toThrowError('Invalid instance of the AppStorage.');
    expect(() => new AppManager(testingInfastructure.getAppStorage(), invalid as any, invalid as any)).toThrowError('Invalid instance of the AppLogStorage.');
    expect(() => new AppManager(
        testingInfastructure.getAppStorage(),
        testingInfastructure.getLogStorage(),
        invalid as any),
    ).toThrowError('Invalid instance of the AppBridges');
});

test('Ensure Managers are Valid Types', () => {
    const manager = new AppManager(
        testingInfastructure.getAppStorage(),
        testingInfastructure.getLogStorage(),
        testingInfastructure.getAppBridges(),
    );

    expect(manager.getParser() instanceof AppPackageParser).toBe(true);
    expect(manager.getCompiler() instanceof AppCompiler).toBe(true);
    expect(manager.getAccessorManager() instanceof AppAccessorManager).toBe(true);
    expect(manager.getBridges() instanceof AppBridges).toBe(true);
    expect(manager.getListenerManager() instanceof AppListenerManager).toBe(true);
    expect(manager.getCommandManager() instanceof AppSlashCommandManager).toBe(true);
    expect(manager.getApiManager() instanceof AppApiManager).toBe(true);
    expect(manager.getSettingsManager() instanceof AppSettingsManager).toBe(true);
});
