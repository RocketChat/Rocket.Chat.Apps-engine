import { Expect, SetupFixture, Test } from 'alsatian';
import { IApiExtend, IExternalComponentExtend, IHttpExtend, ISettingsExtend, ISlashCommandsExtend } from '../../../src/definition/accessors';

import { ConfigurationExtend } from '../../../src/server/accessors';

export class ConfigurationExtendTestFixture {
    private he: IHttpExtend;
    private se: ISettingsExtend;
    private sce: ISlashCommandsExtend;
    private api: IApiExtend;
    private externalComponent: IExternalComponentExtend;

    @SetupFixture
    public setupFixture() {
        this.he = {} as IHttpExtend;
        this.se = {} as ISettingsExtend;
        this.sce = {} as ISlashCommandsExtend;
        this.api = {} as IApiExtend;
        this.externalComponent = {} as IExternalComponentExtend;
    }

    @Test()
    public useConfigurationExtend() {
        Expect(() => new ConfigurationExtend(this.he, this.se, this.sce, this.api, this.externalComponent)).not.toThrow();

        const se = new ConfigurationExtend(this.he, this.se, this.sce, this.api, this.externalComponent);
        Expect(se.http).toBeDefined();
        Expect(se.settings).toBeDefined();
        Expect(se.slashCommands).toBeDefined();
        Expect(se.externalComponent).toBeDefined();
    }
}
