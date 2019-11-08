import { IApi, IApiEndpoint } from '../../../src/definition/api';
import { ApiExtend } from '../../../src/server/accessors';
import { AppManager } from '../../../src/server/AppManager';
import { AppBridges, IAppApiBridge } from '../../../src/server/bridges';
import { AppAccessorManager, AppApiManager } from '../../../src/server/managers';
import { ProxiedApp } from '../../../src/server/ProxiedApp';

let mockApp: ProxiedApp;
let mockApiManager: AppApiManager;
let mockManager: AppManager;
let mockApi: IApi;

beforeAll(() => {
    mockApp = {
        getID() {
            return 'testing';
        },
    } as ProxiedApp;
    mockApi = {
        endpoints: [
            { path: '' } as IApiEndpoint,
        ],
    } as IApi;

    mockManager = {
        getBridges(): AppBridges {
            return {
                getApiBridge(): IAppApiBridge { return {} as IAppApiBridge; },
            } as AppBridges;
        },
        getAccessorManager(): AppAccessorManager {
            return {} as AppAccessorManager;
        },
        getOneById(appId: string): ProxiedApp {
            return mockApp;
        },
    } as AppManager;
    mockApiManager = new AppApiManager(mockManager);
});

test('provideApi', async () => {
    let apiExtend: ApiExtend;

    jest.spyOn(mockApiManager, 'addApi');

    expect(() => apiExtend = new ApiExtend(mockApiManager, mockApp.getID())).not.toThrow();

    await apiExtend.provideApi(mockApi);
    expect(mockApiManager.addApi).toHaveBeenCalledWith(mockApp.getID(), mockApi);
    expect(mockApiManager.addApi).toHaveBeenCalledTimes(1);
});
