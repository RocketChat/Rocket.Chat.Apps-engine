import { Expect, SetupFixture, Test } from 'alsatian';
import { AppManager } from '../../../src/server/AppManager';
import { AppInterface } from '../../../src/server/compiler';
import { AppListenerManager } from '../../../src/server/managers';
import { ProxiedApp } from '../../../src/server/ProxiedApp';

export class AppListenerManagerTestFixture {
    private mockApp: ProxiedApp;
    private mockManager: AppManager;

    @SetupFixture
    public setupFixture() {
        this.mockApp = {
            getID() {
                return 'testing';
            },
            getImplementationList() {
                return {
                    [AppInterface.IPostMessageSent]: true,
                } as { [inte: string]: boolean };
            },
        } as ProxiedApp;

        this.mockManager = {
            getAccessorManager() {
                return;
            },
            getOneById(appId: string) {
                return this.mockApp;
            }
        } as AppManager;
    }

    @Test()
    public basicAppListenerManager() {
        Expect(() => new AppListenerManager(this.mockManager)).not.toThrow();

        const alm = new AppListenerManager(this.mockManager);

        Expect(alm.getListeners(AppInterface.IPostMessageSent).length).toBe(0);
        Expect(() => alm.registerListeners(this.mockApp)).not.toThrow();
        Expect(alm.getListeners(AppInterface.IPostMessageSent).length).toBe(1);
    }
}
