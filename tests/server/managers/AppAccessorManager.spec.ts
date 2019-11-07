import { AppManager } from '../../../src/server/AppManager';
import { AppBridges } from '../../../src/server/bridges';
import { AppAccessorManager, AppApiManager, AppSlashCommandManager  } from '../../../src/server/managers';
import { ProxiedApp } from '../../../src/server/ProxiedApp';
import { TestsAppBridges } from '../../test-data/bridges/appBridges';

let bridges: AppBridges;
let manager: AppManager;
let spies: Array<jest.SpyInstance>;

beforeAll(() =>  {
    bridges = new TestsAppBridges();

    const brds = bridges;
    manager = {
        getBridges() {
            return brds;
        },
        getCommandManager() {
            return {} as AppSlashCommandManager;
        },
        getApiManager() {
            return {} as AppApiManager;
        },
        getOneById(appId: string): ProxiedApp {
            return appId === 'testing' ? {} as ProxiedApp : undefined;
        },
    } as AppManager;
});

beforeEach(() => {
    spies = new Array<jest.SpyInstance>();
    spies.push(jest.spyOn(bridges, 'getServerSettingBridge'));
    spies.push(jest.spyOn(bridges, 'getEnvironmentalVariableBridge'));
    spies.push(jest.spyOn(bridges, 'getMessageBridge'));
    spies.push(jest.spyOn(bridges, 'getPersistenceBridge'));
    spies.push(jest.spyOn(bridges, 'getRoomBridge'));
    spies.push(jest.spyOn(bridges, 'getUserBridge'));
    spies.push(jest.spyOn(manager, 'getBridges'));
    spies.push(jest.spyOn(manager, 'getCommandManager'));
    spies.push(jest.spyOn(manager, 'getApiManager'));
});

afterEach(() => {
    spies.forEach((s) => s.mockClear());
});

test('basicAppAccessorManager', () => {
    expect(() => new AppAccessorManager(manager)).not.toThrow();
    expect(() => new AppAccessorManager(manager).purifyApp('testing')).not.toThrow();
});

test('configurationExtend', () => {
    const acm = new AppAccessorManager(manager);

    expect(acm.getConfigurationExtend('testing')).toBeDefined();
    expect(() => acm.getConfigurationExtend('fake')).toThrowError('No App found by the provided id: fake');
    expect(acm.getConfigurationExtend('testing')).toBeDefined();

    expect(manager.getCommandManager).toHaveBeenCalledTimes(1);
    expect(manager.getApiManager).toHaveBeenCalledTimes(1);
});

test('environmentRead', () => {
    const acm = new AppAccessorManager(manager);

    expect(acm.getEnvironmentRead('testing')).toBeDefined();
    expect(() => acm.getEnvironmentRead('fake')).toThrowError('No App found by the provided id: fake');
    expect(acm.getEnvironmentRead('testing')).toBeDefined();

    expect(bridges.getServerSettingBridge).toHaveBeenCalledTimes(1);
    expect(bridges.getEnvironmentalVariableBridge).toHaveBeenCalledTimes(1);
});

test('configurationModify', () => {
    const acm = new AppAccessorManager(manager);

    expect(acm.getConfigurationModify('testing')).toBeDefined();
    expect(acm.getConfigurationModify('testing')).toBeDefined();

    expect(bridges.getServerSettingBridge).toHaveBeenCalledTimes(1);
    expect(manager.getCommandManager).toHaveBeenCalledTimes(1);
});

test('reader', () => {
    const acm = new AppAccessorManager(manager);

    expect(acm.getReader('testing')).toBeDefined();
    expect(acm.getReader('testing')).toBeDefined();

    expect(bridges.getServerSettingBridge).toHaveBeenCalledTimes(1);
    expect(bridges.getEnvironmentalVariableBridge).toHaveBeenCalledTimes(1);
    expect(bridges.getPersistenceBridge).toHaveBeenCalledTimes(1);
    expect(bridges.getRoomBridge).toHaveBeenCalledTimes(1);
    expect(bridges.getUserBridge).toHaveBeenCalledTimes(1);
    expect(bridges.getMessageBridge).toHaveBeenCalledTimes(2);
});

test('modifier', () => {
    const acm = new AppAccessorManager(manager);

    expect(acm.getModifier('testing')).toBeDefined();
    expect(acm.getModifier('testing')).toBeDefined();

    expect(manager.getBridges).toHaveBeenCalledTimes(1);
    expect(bridges.getMessageBridge).toHaveBeenCalledTimes(1);
});

test('persistence', () => {
    const acm = new AppAccessorManager(manager);

    expect(acm.getPersistence('testing')).toBeDefined();
    expect(acm.getPersistence('testing')).toBeDefined();

    expect(bridges.getPersistenceBridge).toHaveBeenCalledTimes(1);
});

test('http', () => {
    const acm = new AppAccessorManager(manager);

    expect(acm.getHttp('testing')).toBeDefined();
    expect(acm.getHttp('testing')).toBeDefined();

    (acm as any).https.delete('testing');
    expect(acm.getHttp('testing')).toBeDefined();
});
