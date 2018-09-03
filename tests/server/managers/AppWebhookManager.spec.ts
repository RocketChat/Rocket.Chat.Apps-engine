// tslint:disable:max-line-length

import { AsyncTest, Expect, FunctionSpy, RestorableFunctionSpy, Setup, SetupFixture, SpyOn, Teardown, Test } from 'alsatian';
import * as vm from 'vm';
import { AppStatus } from '../../../src/definition/AppStatus';
import { AppMethod } from '../../../src/definition/metadata';
import { TestsAppBridges } from '../../test-data/bridges/appBridges';
import { TestsAppLogStorage } from '../../test-data/logStorage';
import { TestData } from '../../test-data/utilities';

import { RequestMethod } from '../../../src/definition/accessors';
import { IWebhookRequest } from '../../../src/definition/webhooks';
import { AppManager } from '../../../src/server/AppManager';
import { AppBridges } from '../../../src/server/bridges';
import { PathAlreadyExistsError } from '../../../src/server/errors';
import { AppConsole } from '../../../src/server/logging';
import { AppAccessorManager, AppSlashCommandManager, AppWebhookManager } from '../../../src/server/managers';
import { AppWebhook } from '../../../src/server/managers/AppWebhook';
import { ProxiedApp } from '../../../src/server/ProxiedApp';
import { AppLogStorage } from '../../../src/server/storage';

export class AppWebhookManagerTestFixture {
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
                return AppWebhookManagerTestFixture.doThrow ?
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
            getWebhookManager() {
                return {} as AppWebhookManager;
            },
            getOneById(appId: string): ProxiedApp {
                return appId === 'failMePlease' ? undefined : app;
            },
            getLogStorage(): AppLogStorage {
                return new TestsAppLogStorage();
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
        this.spies.push(SpyOn(this.mockBridges.getWebhookBridge(), 'registerWebhook'));
        this.spies.push(SpyOn(this.mockBridges.getWebhookBridge(), 'unregisterWebhooks'));
    }

    @Teardown
    public teardown() {
        this.spies.forEach((s) => s.restore());
    }

    @Test()
    public basicAppWebhookManager() {
        Expect(() => new AppWebhookManager({} as AppManager)).toThrow();
        Expect(() => new AppWebhookManager(this.mockManager)).not.toThrow();

        const ascm = new AppWebhookManager(this.mockManager);
        Expect((ascm as any).manager).toBe(this.mockManager);
        Expect((ascm as any).bridge).toBe(this.mockBridges.getWebhookBridge());
        Expect((ascm as any).accessors).toBe(this.mockManager.getAccessorManager());
        Expect((ascm as any).providedWebhooks).toBeDefined();
        Expect((ascm as any).providedWebhooks.size).toBe(0);
    }

    @Test()
    public registerWebhook() {
        const ascm = new AppWebhookManager(this.mockManager);

        const regInfo = new AppWebhook(this.mockApp, TestData.getWebhook('path'));

        Expect(() => (ascm as any).registerWebhook('testing', regInfo)).not.toThrow();
        Expect(this.mockBridges.getWebhookBridge().registerWebhook).toHaveBeenCalledWith(regInfo.webhook, 'testing');
    }

    @Test()
    public addWebhook() {
        const webhook = TestData.getWebhook('webhookpath');
        const ascm = new AppWebhookManager(this.mockManager);

        Expect(() => ascm.addWebhook('testing', webhook)).not.toThrow();
        Expect(this.mockBridges.getWebhookBridge().webhooks.size).toBe(1);
        Expect((ascm as any).providedWebhooks.size).toBe(1);
        Expect((ascm as any).providedWebhooks.get('testing').get('webhookpath').webhook).toBe(webhook);

        Expect(() => ascm.addWebhook('testing', webhook)).toThrowError(PathAlreadyExistsError, 'The webhook path "webhookpath" already exists in the system.');

        Expect(() => ascm.addWebhook('failMePlease', TestData.getWebhook('yet-another'))).toThrowError(Error, 'App must exist in order for a webhook to be added.');
        Expect(() => ascm.addWebhook('testing', TestData.getWebhook('another-webhook'))).not.toThrow();
        Expect((ascm as any).providedWebhooks.size).toBe(1);
        Expect((ascm as any).providedWebhooks.get('testing').size).toBe(2);
    }

    @Test()
    public registerWebhooks() {
        const ascm = new AppWebhookManager(this.mockManager);

        SpyOn(ascm, 'registerWebhook');

        ascm.addWebhook('testing', TestData.getWebhook('webhookpath'));
        const regInfo = (ascm as any).providedWebhooks.get('testing').get('webhookpath') as AppWebhook;

        Expect(() => ascm.registerWebhooks('non-existant')).not.toThrow();
        Expect(() => ascm.registerWebhooks('testing')).not.toThrow();
        Expect((ascm as any).registerWebhook as FunctionSpy).toHaveBeenCalledWith('testing', regInfo).exactly(1);
        Expect(this.mockBridges.getWebhookBridge().registerWebhook).toHaveBeenCalledWith(regInfo.webhook, 'testing').exactly(1);
    }

    @Test()
    public unregisterWebhooks() {
        const ascm = new AppWebhookManager(this.mockManager);

        ascm.addWebhook('testing', TestData.getWebhook('webhookpath'));

        Expect(() => ascm.unregisterWebhooks('non-existant')).not.toThrow();
        Expect(() => ascm.unregisterWebhooks('testing')).not.toThrow();
        Expect(this.mockBridges.getWebhookBridge().unregisterWebhooks).toHaveBeenCalled().exactly(1);
    }

    @AsyncTest()
    public async executeWebhooks() {
        const ascm = new AppWebhookManager(this.mockManager);
        ascm.addWebhook('testing', TestData.getWebhook('webhook1'));
        ascm.addWebhook('testing', TestData.getWebhook('webhook2'));
        ascm.addWebhook('testing', TestData.getWebhook('webhook3'));
        ascm.registerWebhooks('testing');

        SpyOn(this.mockApp, 'runInContext');
        const request: IWebhookRequest = {
            method: RequestMethod.GET,
            headers: {},
            query: {},
            params: {},
            content: '',
        };

        await Expect(async () => await ascm.executeWebhook('testing', 'nope', request)).not.toThrowAsync();
        await Expect(async () => await ascm.executeWebhook('testing', 'not-exists', request)).not.toThrowAsync();
        await Expect(async () => await ascm.executeWebhook('testing', 'webhook1', request)).not.toThrowAsync();
        await Expect(async () => await ascm.executeWebhook('testing', 'webhook2', request)).not.toThrowAsync();
        await Expect(async () => await ascm.executeWebhook('testing', 'webhook3', request)).not.toThrowAsync();

        Expect(this.mockApp.runInContext).toHaveBeenCalled().exactly(3);
    }
}
