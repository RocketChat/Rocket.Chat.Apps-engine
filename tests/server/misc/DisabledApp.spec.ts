import { AsyncTest, Expect, SetupFixture } from 'alsatian';

import { AppStatus } from '../../../src/definition/AppStatus';
import { AppMethod, IAppInfo } from '../../../src/definition/metadata';
import { AppManager } from '../../../src/server/AppManager';
import { AppBridges, IInternalBridge } from '../../../src/server/bridges';
import { AppConsole } from '../../../src/server/logging';
import { DisabledApp } from '../../../src/server/misc/DisabledApp';
import { TestsAppBridges } from '../../test-data/bridges/appBridges';

export class DisabledAppTestFixture {
    private expectedInfo: IAppInfo = {
        id: '614055e2-3dba-41fb-be48-c1ff146f5932',
        name: 'Testing App',
        nameSlug: 'testing-app',
        description: 'A Rocket.Chat Application used to test out the various features.',
        version: '0.0.8',
        requiredApiVersion: '>=0.9.6',
        author: {
            name: 'Bradley Hilton',
            homepage: 'https://github.com/RocketChat/Rocket.Chat.Apps-ts-definitions',
            support: 'https://github.com/RocketChat/Rocket.Chat.Apps-ts-definitions/issues',
        },
        classFile: 'TestingApp.ts',
        iconFile: 'testing.jpg',
    };
    private mockManager: AppManager;
    private mockBridges: AppBridges;
    private mockInternalBridge: IInternalBridge;

    @SetupFixture
    public setupFixture() {
        this.mockBridges = new TestsAppBridges();

        const bridges = this.mockBridges;

        this.mockInternalBridge = {
            async isDevelopmentModeEnabled() {
                return true;
            },
        } as IInternalBridge;

        bridges.getInternalBridge = () => this.mockInternalBridge;

        this.mockManager = {
            getBridges() {
                return bridges;
            },
        } as AppManager;
    }

    @AsyncTest()
    public async createNewDisabledApp() {
        Expect(() => DisabledApp.createNew(
            this.expectedInfo, AppStatus.COMPILER_ERROR_DISABLED,
            new AppConsole(AppMethod._CONSTRUCTOR, this.mockManager)),
        ).not.toThrow();
        const disabledApp = DisabledApp.createNew(
            this.expectedInfo, AppStatus.COMPILER_ERROR_DISABLED,
            new AppConsole(AppMethod._CONSTRUCTOR, this.mockManager),
        );

        Expect(disabledApp).toBeDefined();
        Expect(disabledApp.getLogger()).toBeDefined();
        Expect(disabledApp.getInfo()).toEqual(this.expectedInfo);
        Expect(disabledApp.getStatus()).toEqual(AppStatus.COMPILER_ERROR_DISABLED);
        Expect(() => disabledApp.onEnable()).not.toThrow();
        Expect(await disabledApp.onEnable()).toEqual(false);

    }
}
