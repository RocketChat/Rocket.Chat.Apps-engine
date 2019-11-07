import * as vm from 'vm';

import { AppStatus } from '../../../src/definition/AppStatus';
import { AppMethod } from '../../../src/definition/metadata';
import { AppAccessors } from '../../../src/server/accessors';
import { AppManager } from '../../../src/server/AppManager';
import { AppBridges } from '../../../src/server/bridges';
import { AppConsole } from '../../../src/server/logging';
import {
    AppAccessorManager,
    AppApiManager,
    AppSlashCommandManager,
} from '../../../src/server/managers';
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
let mockApiManager: AppApiManager;

beforeAll(() => {
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

    mockApiManager = new AppApiManager(mockManager);
    const apiManager = mockApiManager;
    mockManager.getApiManager = function _getApiManager(): AppApiManager {
        return apiManager;
    };
});

beforeEach(() => {
    mockBridges = new TestsAppBridges();
    const bri = mockBridges;
    mockManager.getBridges = function _refreshedGetBridges(): AppBridges {
        return bri;
    };

    mockApiManager = new AppApiManager(mockManager);
    const apiManager = mockApiManager;
    mockManager.getApiManager = function _refreshedGetApiManager(): AppApiManager {
        return apiManager;
    };
});

test('testAppAccessor', () => {
    expect(() => new AppAccessors({} as AppManager, '')).toThrow();
    expect(() => new AppAccessors(mockManager, 'testing')).not.toThrow();

    const appAccessors = new AppAccessors(mockManager, 'testing');

    expect(appAccessors.environmentReader).toEqual(mockAccessors.getEnvironmentRead('testing'));
    expect(appAccessors.reader).toEqual(mockAccessors.getReader('testing'));
    expect(appAccessors.http).toEqual(mockAccessors.getHttp('testing'));
    expect(appAccessors.providedApiEndpoints).toEqual(mockApiManager.listApis('testing'));

    mockApiManager.addApi('testing', TestData.getApi('app-accessor-api'));

    expect(appAccessors.providedApiEndpoints).toEqual(mockApiManager.listApis('testing'));
});
