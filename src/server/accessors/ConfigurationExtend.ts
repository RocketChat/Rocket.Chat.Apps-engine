import {
    IConfigurationExtend,
    IHttpExtend,
    ISettingsExtend,
    ISlashCommandsExtend,
    IWebhooksExtend,
} from '../../definition/accessors';

export class ConfigurationExtend implements IConfigurationExtend {
    public readonly http: IHttpExtend;
    public readonly settings: ISettingsExtend;
    public readonly slashCommands: ISlashCommandsExtend;
    public readonly webhooks: IWebhooksExtend;

    constructor(https: IHttpExtend, sets: ISettingsExtend, cmds: ISlashCommandsExtend, webhooks: IWebhooksExtend) {
        this.http = https;
        this.settings = sets;
        this.slashCommands = cmds;
        this.webhooks = webhooks;
    }
}
