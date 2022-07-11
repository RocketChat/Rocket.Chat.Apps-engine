import { Expect, Setup, SetupFixture, Teardown, Test } from 'alsatian';
import { IOAuthAppParams } from '../../../src/definition/accessors/IOAuthApps';
import { AppManager } from '../../../src/server/AppManager';
import { AppBridges } from '../../../src/server/bridges';
import { AppApiManager, AppExternalComponentManager, AppOAuthAppsManager, AppSchedulerManager, AppSlashCommandManager, AppVideoConfProviderManager } from '../../../src/server/managers';
import { UIActionButtonManager } from '../../../src/server/managers/UIActionButtonManager';
import { ProxiedApp } from '../../../src/server/ProxiedApp';
import { AppLogStorage } from '../../../src/server/storage';
import { TestsAppBridges } from '../../test-data/bridges/appBridges';
import { TestsAppLogStorage } from '../../test-data/storage/logStorage';
import { TestData } from '../../test-data/utilities';

export class AppOAuthAppsManagerTestFixture {
    public static doThrow: boolean = false;
    private mockBridges: TestsAppBridges;
    private mockApp: ProxiedApp;
    private mockManager: AppManager;

    @SetupFixture
    public setupFixture() {
        this.mockBridges = new TestsAppBridges();

        this.mockApp = TestData.getMockApp('testing', 'testing');

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
            getUIActionButtonManager() {
                return {} as UIActionButtonManager;
            },
            getVideoConfProviderManager() {
                return {} as AppVideoConfProviderManager;
            },
            getOAuthAppsManager(): AppOAuthAppsManager {
                return {} as AppOAuthAppsManager;
            },
        } as AppManager;

        this.mockManager.getBridges = function _refreshedGetBridges(): AppBridges {
            return bri;
        };
    }

    @Setup
    public setup() {
    }

    @Teardown
    public teardown() {
    }

    @Test()
    public basicAppOAuthAppsManager() {
        Expect(() => new AppOAuthAppsManager({} as AppManager)).toThrow();
        Expect(() => new AppOAuthAppsManager(this.mockManager)).not.toThrow();

        const manager = new AppOAuthAppsManager(this.mockManager);
        Expect((manager as any).manager).toBe(this.mockManager);
    }

    @Test()
    public async create() {
        const manager = new AppOAuthAppsManager(this.mockManager);
        Expect(() => manager.create(TestData.getOAuthApp(true) as IOAuthAppParams, 'app-123')).not.toThrow();
    }

    @Test()
    public async getById() {
        const manager = new AppOAuthAppsManager(this.mockManager);
        Expect(() => manager.getById('oauth-123', 'app-123')).not.toThrow();
    }

    @Test()
    public async update() {
        const manager = new AppOAuthAppsManager(this.mockManager);
        Expect(() => manager.update(TestData.getOAuthApp(true) as IOAuthAppParams, 'oauth-123', 'app-123')).not.toThrow();
    }

    @Test()
    public async delete() {
        const manager = new AppOAuthAppsManager(this.mockManager);
        Expect(() => manager.delete('oauth-123', 'app-123')).not.toThrow();
    }

    @Test()
    public async removeAllOAuthApps() {
        const manager = new AppOAuthAppsManager(this.mockManager);
        Expect(() => manager.removeAllOAuthApps('app-123')).not.toThrow();
    }
}
