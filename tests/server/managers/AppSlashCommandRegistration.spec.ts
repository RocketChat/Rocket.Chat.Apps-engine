import { ISlashCommand } from '@rocket.chat/apps-ts-definition/slashcommands';
import { Expect, Test } from 'alsatian';

import { AppSlashCommandRegistration } from '../../../src/server/managers/AppSlashCommandRegistration';

export class AppSlashCommandRegistrationTestFixture {
    @Test()
    public ensureAppSlashCommandRegistration() {
        Expect(() => new AppSlashCommandRegistration({} as ISlashCommand)).not.toThrow();

        const ascr = new AppSlashCommandRegistration({} as ISlashCommand);
        Expect(ascr.isRegistered).toBe(false);
        Expect(ascr.isEnabled).toBe(false);
        Expect(ascr.isDisabled).toBe(false);

        ascr.hasBeenRegistered();
        Expect(ascr.isDisabled).toBe(false);
        Expect(ascr.isEnabled).toBe(true);
        Expect(ascr.isRegistered).toBe(true);
    }
}
