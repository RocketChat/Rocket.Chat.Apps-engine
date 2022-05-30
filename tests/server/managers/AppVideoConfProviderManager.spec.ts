import { AsyncTest, Expect, Setup, SetupFixture, Teardown, Test } from 'alsatian';
import { TestsAppBridges } from '../../test-data/bridges/appBridges';
import { TestsAppLogStorage } from '../../test-data/storage/logStorage';
import { TestData } from '../../test-data/utilities';

import { AppManager } from '../../../src/server/AppManager';
import { AppBridges } from '../../../src/server/bridges';
import { AVideoConfProviderAlreadyExistsError, NoVideoConfProviderRegisteredError } from '../../../src/server/errors';
import { AppAccessorManager, AppApiManager, AppExternalComponentManager, AppSchedulerManager, AppSlashCommandManager, AppVideoConfProviderManager } from '../../../src/server/managers';
import { AppVideoConfProvider } from '../../../src/server/managers/AppVideoConfProvider';
import { UIActionButtonManager } from '../../../src/server/managers/UIActionButtonManager';
import { ProxiedApp } from '../../../src/server/ProxiedApp';
import { AppLogStorage } from '../../../src/server/storage';

export class AppVideoConfProviderManagerTestFixture {
    public static doThrow: boolean = false;
    private mockBridges: TestsAppBridges;
    private mockApp: ProxiedApp;
    private mockAccessors: AppAccessorManager;
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
        } as AppManager;

        this.mockAccessors = new AppAccessorManager(this.mockManager);
        const ac = this.mockAccessors;
        this.mockManager.getAccessorManager = function _getAccessorManager(): AppAccessorManager {
            return ac;
        };
    }

    @Setup
    public setup() {
    }

    @Teardown
    public teardown() {
    }

    @Test()
    public basicAppVideoConfProviderManager() {
        Expect(() => new AppVideoConfProviderManager({} as AppManager)).toThrow();
        Expect(() => new AppVideoConfProviderManager(this.mockManager)).not.toThrow();

        const manager = new AppVideoConfProviderManager(this.mockManager);
        Expect((manager as any).manager).toBe(this.mockManager);
        Expect((manager as any).accessors).toBe(this.mockManager.getAccessorManager());
        Expect((manager as any).videoConfProviders).toBeDefined();
        Expect((manager as any).videoConfProviders.size).toBe(0);
    }

    @Test()
    public aaddProvider() {
        const provider = TestData.getVideoConfProvider();
        const manager = new AppVideoConfProviderManager(this.mockManager);

        Expect(() => manager.addProvider('testing', provider)).not.toThrow();
        Expect((manager as any).videoConfProviders.size).toBe(1);
        Expect(() => manager.addProvider('testing', provider))
            .toThrowError(AVideoConfProviderAlreadyExistsError, 'A video conference provider is already registered in the system.');
        Expect(() => manager.addProvider('failMePlease', provider))
            .toThrowError(Error, 'App must exist in order for a video conference provider to be added.');
        Expect((manager as any).videoConfProviders.size).toBe(1);
    }

    @Test()
    public registerProviders() {
        const manager = new AppVideoConfProviderManager(this.mockManager);

        manager.addProvider('testing', TestData.getVideoConfProvider());
        const firstRegInfo = (manager as any).videoConfProviders.get('testing') as AppVideoConfProvider;

        manager.addProvider('testing2', TestData.getVideoConfProvider());
        const secondRegInfo = (manager as any).videoConfProviders.get('testing2') as AppVideoConfProvider;

        Expect(() => manager.registerProviders('non-existant')).not.toThrow();
        Expect(() => manager.registerProviders('testing')).not.toThrow();
        Expect(firstRegInfo.isRegistered).toBe(true);
        Expect(secondRegInfo.isRegistered).toBe(false);

        Expect(() => manager.registerProviders('testing2'))
            .toThrowError(AVideoConfProviderAlreadyExistsError, 'A video conference provider is already registered in the system.');
    }

    @Test()
    public unregisterProviders() {
        const manager = new AppVideoConfProviderManager(this.mockManager);

        manager.addProvider('testing', TestData.getVideoConfProvider());
        const regInfo = (manager as any).videoConfProviders.get('testing') as AppVideoConfProvider;
        Expect(() => manager.registerProviders('testing')).not.toThrow();

        Expect(() => manager.unregisterProviders('non-existant')).not.toThrow();
        Expect(regInfo.isRegistered).toBe(true);
        Expect(() => manager.unregisterProviders('testing')).not.toThrow();
        Expect(regInfo.isRegistered).toBe(false);
    }

    @AsyncTest()
    public async failToGenerateUrlWithoutProvider() {
        const manager = new AppVideoConfProviderManager(this.mockManager);

        await Expect(async () => manager.generateUrl('callId'))
            .toThrowErrorAsync(NoVideoConfProviderRegisteredError, 'There are no video conference providers registered in the system.');

        manager.addProvider('testing', TestData.getVideoConfProvider());

        await Expect(async () => await manager.generateUrl('callId'))
            .toThrowErrorAsync(NoVideoConfProviderRegisteredError, 'There are no video conference providers registered in the system.');
    }

    @AsyncTest()
    public async generateUrl() {
        const manager = new AppVideoConfProviderManager(this.mockManager);
        manager.addProvider('testing', TestData.getVideoConfProvider());
        manager.registerProviders('testing');

        const url = await manager.generateUrl('first-call');
        await Expect(url).toBe('video-conf/first-call');
    }

    @AsyncTest()
    public async failToCustomizeUrlWithoutProvider() {
        const manager = new AppVideoConfProviderManager(this.mockManager);
        const call = TestData.getVideoConference();
        const user = TestData.getVideoConferenceUser();

        await Expect(async () => await manager.customizeUrl(call, user, {}))
            .toThrowErrorAsync(NoVideoConfProviderRegisteredError, 'There are no video conference providers registered in the system.');

        manager.addProvider('testing', TestData.getVideoConfProvider());

        await Expect(async () => await manager.customizeUrl(call, user, {}))
            .toThrowErrorAsync(NoVideoConfProviderRegisteredError, 'There are no video conference providers registered in the system.');
    }

    @AsyncTest()
    public async customizeUrl() {
        const manager = new AppVideoConfProviderManager(this.mockManager);
        manager.addProvider('testing', TestData.getVideoConfProvider());
        manager.registerProviders('testing');

        const call = TestData.getVideoConference();
        const user = TestData.getVideoConferenceUser();

        await Expect(await manager.customizeUrl(call, user, {})).toBe('video-conf/first-call#caller');
        await Expect(await manager.customizeUrl(call, undefined, {})).toBe('video-conf/first-call#');
    }
}
