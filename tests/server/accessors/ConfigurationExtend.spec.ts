import { Expect, SetupFixture, Test } from 'alsatian';
import { IHttpExtend, ISettingsExtend, ISlashCommandsExtend, IWebhooksExtend } from '../../../src/definition/accessors';

import { ConfigurationExtend } from '../../../src/server/accessors';

export class ConfigurationExtendTestFixture {
    private he: IHttpExtend;
    private se: ISettingsExtend;
    private sce: ISlashCommandsExtend;
    private we: IWebhooksExtend;

    @SetupFixture
    public setupFixture() {
        this.he = {} as IHttpExtend;
        this.se = {} as ISettingsExtend;
        this.sce = {} as ISlashCommandsExtend;
        this.we = {} as IWebhooksExtend;
    }

    @Test()
    public useConfigurationExtend() {
        Expect(() => new ConfigurationExtend(this.he, this.se, this.sce, this.we)).not.toThrow();

        const se = new ConfigurationExtend(this.he, this.se, this.sce, this.we);
        Expect(se.http).toBeDefined();
        Expect(se.settings).toBeDefined();
        Expect(se.slashCommands).toBeDefined();
    }
}
