// tslint:disable:max-line-length
import { Expect, Test } from 'alsatian';
import { SimpleClass, TestsData } from '../test-data/utilities';

import { AppManager } from '../../src/server/AppManager';

export class AppManagerTestFixture {
    @Test('Setup of the AppManager')
    public setupAppManager() {
        const manager = new AppManager(TestsData.getAppStorage(), TestsData.getLogStorage(), TestsData.getAppBridges());

        Expect(manager.getStorage()).toBe(TestsData.getAppStorage());
        Expect(manager.getLogStorage()).toBe(TestsData.getLogStorage());
        Expect(manager.getBridges()).toBe(TestsData.getAppBridges());
    }

    @Test('Invalid Storage and Bridge')
    public invalidInstancesPassed() {
        const invalid = new SimpleClass();
        Expect(() => new AppManager(invalid as any, invalid as any, invalid as any)).toThrowError(Error, 'Invalid instance of the AppStorage.');
        Expect(() => new AppManager(TestsData.getAppStorage(), invalid as any, invalid as any)).toThrowError(Error, 'Invalid instance of the AppLogStorage.');
        Expect(() => new AppManager(TestsData.getAppStorage(), TestsData.getLogStorage(), invalid as any)).toThrowError(Error, 'Invalid instance of the AppBridges');
    }
}
