import * as vm from 'vm';

import { RequestMethod } from '../../../src/definition/accessors';
import { IApi, IApiRequest } from '../../../src/definition/api';
import { AppStatus } from '../../../src/definition/AppStatus';
import { AppMethod } from '../../../src/definition/metadata';
import { AppManager } from '../../../src/server/AppManager';
import { AppBridges } from '../../../src/server/bridges';
import { PathAlreadyExistsError } from '../../../src/server/errors';
import { AppConsole } from '../../../src/server/logging';
import { AppAccessorManager, AppApiManager, AppSlashCommandManager } from '../../../src/server/managers';
import { AppApi } from '../../../src/server/managers/AppApi';
import { ProxiedApp } from '../../../src/server/ProxiedApp';
import { AppLogStorage } from '../../../src/server/storage';
import { TestsAppBridges } from '../../test-data/bridges/appBridges';
import { TestsAppLogStorage } from '../../test-data/logStorage';
import { TestData } from '../../test-data/utilities';

const doThrow: boolean = false;
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
            return doThrow ? Promise.reject('You told me so') : Promise.resolve();
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
    spies.push(jest.spyOn(mockBridges.getApiBridge(), 'registerApi'));
    spies.push(jest.spyOn(mockBridges.getApiBridge(), 'unregisterApis'));
});

afterEach(() => {
    spies.forEach((s) => s.mockClear());
});

test('basicAppApiManager', () => {
    expect(() => new AppApiManager({} as AppManager)).toThrow();
    expect(() => new AppApiManager(mockManager)).not.toThrow();

    const ascm = new AppApiManager(mockManager);
    expect((ascm as any).manager).toBe(mockManager);
    expect((ascm as any).bridge).toBe(mockBridges.getApiBridge());
    expect((ascm as any).accessors).toBe(mockManager.getAccessorManager());
    expect((ascm as any).providedApis).toBeDefined();
    expect((ascm as any).providedApis.size).toBe(0);
});

test('registerApi', () => {
    const ascm = new AppApiManager(mockManager);

    const api: IApi = TestData.getApi('path');
    const regInfo = new AppApi(mockApp, api, api.endpoints[0]);

    expect(() => (ascm as any).registerApi('testing', regInfo)).not.toThrow();
    expect(mockBridges.getApiBridge().registerApi).toHaveBeenCalledWith(regInfo, 'testing');
});

test('addApi', () => {
    const api = TestData.getApi('apipath');
    const ascm = new AppApiManager(mockManager);

    expect(() => ascm.addApi('testing', api)).not.toThrow();
    expect(mockBridges.getApiBridge().apis.size).toBe(1);
    expect((ascm as any).providedApis.size).toBe(1);
    expect((ascm as any).providedApis.get('testing').get('apipath').api).toBe(api);

    expect(() => ascm.addApi('testing', api)).toThrowError(new PathAlreadyExistsError('apipath'));

    expect(() => ascm.addApi('failMePlease', TestData.getApi('yet-another'))).toThrowError('App must exist in order for an api to be added.');
    expect(() => ascm.addApi('testing', TestData.getApi('another-api'))).not.toThrow();
    expect((ascm as any).providedApis.size).toBe(1);
    expect((ascm as any).providedApis.get('testing').size).toBe(2);
});

test('registerApis', () => {
    const ascm = new AppApiManager(mockManager);

    jest.spyOn<any, string>(ascm, 'registerApi');

    ascm.addApi('testing', TestData.getApi('apipath'));
    const regInfo = (ascm as any).providedApis.get('testing').get('apipath') as AppApi;

    expect(() => ascm.registerApis('non-existant')).not.toThrow();
    expect(() => ascm.registerApis('testing')).not.toThrow();
    expect((ascm as any).registerApi).toHaveBeenCalledWith('testing', regInfo);
    expect(mockBridges.getApiBridge().registerApi).toHaveBeenCalledWith(regInfo, 'testing');
});

test('unregisterApis', () => {
    const ascm = new AppApiManager(mockManager);

    ascm.addApi('testing', TestData.getApi('apipath'));

    expect(() => ascm.unregisterApis('non-existant')).not.toThrow();
    expect(() => ascm.unregisterApis('testing')).not.toThrow();
    expect(mockBridges.getApiBridge().unregisterApis).toHaveBeenCalledTimes(1);
});

test('executeApis', async () => {
    const ascm = new AppApiManager(mockManager);
    ascm.addApi('testing', TestData.getApi('api1'));
    ascm.addApi('testing', TestData.getApi('api2'));
    ascm.addApi('testing', TestData.getApi('api3'));
    ascm.registerApis('testing');

    jest.spyOn(mockApp, 'runInContext');
    const request: IApiRequest = {
        method: RequestMethod.GET,
        headers: {},
        query: {},
        params: {},
        content: '',
    };

    await expect(async () => await ascm.executeApi('testing', 'nope', request)).not.toThrow();
    await expect(async () => await ascm.executeApi('testing', 'not-exists', request)).not.toThrow();
    await expect(async () => await ascm.executeApi('testing', 'api1', request)).not.toThrow();
    await expect(async () => await ascm.executeApi('testing', 'api2', request)).not.toThrow();
    await expect(async () => await ascm.executeApi('testing', 'api3', request)).not.toThrow();

    expect(mockApp.runInContext).toHaveBeenCalledTimes(3);
});

test('listApis', () => {
    const ascm = new AppApiManager(mockManager);

    expect(ascm.listApis('testing')).toEqual([]);

    ascm.addApi('testing', TestData.getApi('api1'));
    ascm.registerApis('testing');

    expect(() => ascm.listApis('testing')).not.toThrow();
    expect(ascm.listApis('testing')).not.toEqual([]);
    expect(ascm.listApis('testing')).toEqual([{
        path: 'api1',
        computedPath: '/api/apps/public/testing/api1',
        methods: ['get'],
        examples: {},
    }]);
});
