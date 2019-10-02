import {
    IApiExtend,
    IConfigurationExtend,
    IExternalComponentExtend,
    IHttpExtend,
    ISettingsExtend,
    ISlashCommandsExtend,
} from '../../definition/accessors';

export class ConfigurationExtend implements IConfigurationExtend {
    public readonly http: IHttpExtend;
    public readonly settings: ISettingsExtend;
    public readonly slashCommands: ISlashCommandsExtend;
    public readonly api: IApiExtend;

    public readonly externalComponent: IExternalComponentExtend;

    constructor(
        https: IHttpExtend,
        sets: ISettingsExtend,
        cmds: ISlashCommandsExtend,
        api: IApiExtend,
        externalComponent: IExternalComponentExtend,
    ) {
        this.http = https;
        this.settings = sets;
        this.slashCommands = cmds;
        this.api = api;
        this.externalComponent = externalComponent;
    }
}
