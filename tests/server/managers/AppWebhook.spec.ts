import { Expect, SetupFixture, Test } from 'alsatian';

import { IWebhook } from '../../../src/definition/webhooks';
import { AppWebhook } from '../../../src/server/managers/AppWebhook';
import { ProxiedApp } from '../../../src/server/ProxiedApp';

export class AppWebhookRegistrationTestFixture {
    private mockApp: ProxiedApp;

    @SetupFixture
    public setupFixture() {
        this.mockApp = {} as ProxiedApp;
    }

    @Test()
    public ensureAppWebhook() {
        Expect(() => new AppWebhook(this.mockApp, {} as IWebhook)).not.toThrow();

        const ascr = new AppWebhook(this.mockApp, {} as IWebhook);
        Expect(ascr.app).toBeDefined();
        Expect(ascr.webhook).toBeDefined();
    }
}
