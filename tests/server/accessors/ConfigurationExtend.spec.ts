import { Expect, SetupFixture, Test } from 'alsatian';
import { IApiExtend, IHttpExtend, ISettingsExtend, ISlashCommandsExtend } from '../../../src/definition/accessors';

import { ConfigurationExtend } from '../../../src/server/accessors';

export class ConfigurationExtendTestFixture {
    private he: IHttpExtend;
    private se: ISettingsExtend;
    private sce: ISlashCommandsExtend;
    private api: IApiExtend;

    @SetupFixture
    public setupFixture() {
        this.he = {} as IHttpExtend;
        this.se = {} as ISettingsExtend;
        this.sce = {} as ISlashCommandsExtend;
        this.api = {} as IApiExtend;
    }

    @Test()
    public useConfigurationExtend() {
        Expect(() => new ConfigurationExtend(this.he, this.se, this.sce, this.api)).not.toThrow();

        const se = new ConfigurationExtend(this.he, this.se, this.sce, this.api);
        Expect(se.http).toBeDefined();
        Expect(se.settings).toBeDefined();
        Expect(se.slashCommands).toBeDefined();
    }
}
