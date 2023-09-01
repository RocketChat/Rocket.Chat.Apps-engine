import { Expect, SetupFixture, Test } from 'alsatian';

import { AppMethod } from '../../../src/definition/metadata';
import type { IVideoConfProvider } from '../../../src/definition/videoConfProviders';
import { AppVideoConfProvider } from '../../../src/server/managers/AppVideoConfProvider';
import type { ProxiedApp } from '../../../src/server/ProxiedApp';

export class AppSlashCommandRegistrationTestFixture {
    private mockApp: ProxiedApp;

    @SetupFixture
    public setupFixture() {
        this.mockApp = {
            hasMethod(method: AppMethod): boolean {
                return true;
            },
        } as ProxiedApp;
    }

    @Test()
    public ensureAppVideoConfManager() {
        Expect(() => new AppVideoConfProvider(this.mockApp, {} as IVideoConfProvider)).not.toThrow();

        const ascr = new AppVideoConfProvider(this.mockApp, {} as IVideoConfProvider);
        Expect(ascr.isRegistered).toBe(false);

        ascr.hasBeenRegistered();
        Expect(ascr.isRegistered).toBe(true);

        Expect(ascr.canBeRan(AppMethod._VIDEOCONF_GENERATE_URL)).toBe(true);
        Expect(ascr.canBeRan(AppMethod._VIDEOCONF_CUSTOMIZE_URL)).toBe(true);
    }
}
