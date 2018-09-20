import { Expect, SetupFixture, Test } from 'alsatian';

import { IApi } from '../../../src/definition/api';
import { AppApi } from '../../../src/server/managers/AppApi';
import { ProxiedApp } from '../../../src/server/ProxiedApp';

export class AppApiRegistrationTestFixture {
    private mockApp: ProxiedApp;

    @SetupFixture
    public setupFixture() {
        this.mockApp = {} as ProxiedApp;
    }

    @Test()
    public ensureAppApi() {
        Expect(() => new AppApi(this.mockApp, {} as IApi)).not.toThrow();

        const ascr = new AppApi(this.mockApp, {} as IApi);
        Expect(ascr.app).toBeDefined();
        Expect(ascr.api).toBeDefined();
    }
}
