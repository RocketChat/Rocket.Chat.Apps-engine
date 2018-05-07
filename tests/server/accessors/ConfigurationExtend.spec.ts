import { IHttpExtend, ISettingsExtend, ISlashCommandsExtend } from '@rocket.chat/apps-ts-definition/accessors';
import { Expect, SetupFixture, Test } from 'alsatian';

import { ConfigurationExtend } from '../../../src/server/accessors';

export class ConfigurationExtendTestFixture {
    private he: IHttpExtend;
    private se: ISettingsExtend;
    private sce: ISlashCommandsExtend;

    @SetupFixture
    public setupFixture() {
        this.he = {} as IHttpExtend;
        this.se = {} as ISettingsExtend;
        this.sce = {} as ISlashCommandsExtend;
    }

    @Test()
    public useConfigurationExtend() {
        Expect(() => new ConfigurationExtend(this.he, this.se, this.sce)).not.toThrow();

        const se = new ConfigurationExtend(this.he, this.se, this.sce);
        Expect(se.http).toBeDefined();
        Expect(se.settings).toBeDefined();
        Expect(se.slashCommands).toBeDefined();
    }
}
