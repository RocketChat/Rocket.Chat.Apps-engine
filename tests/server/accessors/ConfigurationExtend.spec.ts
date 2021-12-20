import { Expect, SetupFixture, Test } from 'alsatian';
import { IApiExtend, IExternalComponentsExtend, IHttpExtend, ISchedulerExtend, ISettingsExtend, ISlashCommandsExtend, IUIExtend } from '../../../src/definition/accessors';

import { ConfigurationExtend } from '../../../src/server/accessors';

export class ConfigurationExtendTestFixture {
    private he: IHttpExtend;
    private se: ISettingsExtend;
    private sce: ISlashCommandsExtend;
    private api: IApiExtend;
    private externalComponent: IExternalComponentsExtend;
    private schedulerExtend: ISchedulerExtend;
    private uiExtend: IUIExtend;

    @SetupFixture
    public setupFixture() {
        this.he = {} as IHttpExtend;
        this.se = {} as ISettingsExtend;
        this.sce = {} as ISlashCommandsExtend;
        this.api = {} as IApiExtend;
        this.externalComponent = {} as IExternalComponentsExtend;
        this.schedulerExtend = {} as ISchedulerExtend;
        this.uiExtend = {} as IUIExtend;
    }

    @Test()
    public useConfigurationExtend() {
        Expect(() => new ConfigurationExtend(this.he, this.se, this.sce, this.api, this.externalComponent, this.schedulerExtend, this.uiExtend)).not.toThrow();

        const se = new ConfigurationExtend(this.he, this.se, this.sce, this.api, this.externalComponent, this.schedulerExtend, this.uiExtend);
        Expect(se.http).toBeDefined();
        Expect(se.settings).toBeDefined();
        Expect(se.slashCommands).toBeDefined();
        Expect(se.externalComponents).toBeDefined();
    }
}
