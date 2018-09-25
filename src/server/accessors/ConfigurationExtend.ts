import {
    IApiExtend,
    IConfigurationExtend,
    IHttpExtend,
    ISettingsExtend,
    ISlashCommandsExtend,
} from '../../definition/accessors';

export class ConfigurationExtend implements IConfigurationExtend {
    public readonly http: IHttpExtend;
    public readonly settings: ISettingsExtend;
    public readonly slashCommands: ISlashCommandsExtend;
    public readonly api: IApiExtend;

    constructor(https: IHttpExtend, sets: ISettingsExtend, cmds: ISlashCommandsExtend, api: IApiExtend) {
        this.http = https;
        this.settings = sets;
        this.slashCommands = cmds;
        this.api = api;
    }
}
