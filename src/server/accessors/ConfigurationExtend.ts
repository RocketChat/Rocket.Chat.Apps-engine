import {
    IApiExtend,
    IConfigurationExtend,
    IExternalComponentsExtend,
    IHttpExtend,
    ISchedulerExtend,
    ISettingsExtend,
    ISlashCommandsExtend,
} from '../../definition/accessors';

export class ConfigurationExtend implements IConfigurationExtend {
    public readonly http: IHttpExtend;
    public readonly settings: ISettingsExtend;
    public readonly slashCommands: ISlashCommandsExtend;
    public readonly api: IApiExtend;

    public readonly externalComponents: IExternalComponentsExtend;

    public readonly scheduler: ISchedulerExtend;

    constructor(
        https: IHttpExtend,
        sets: ISettingsExtend,
        cmds: ISlashCommandsExtend,
        api: IApiExtend,
        externalComponents: IExternalComponentsExtend,
        scheduler: ISchedulerExtend,
    ) {
        this.http = https;
        this.settings = sets;
        this.slashCommands = cmds;
        this.api = api;
        this.externalComponents = externalComponents;
        this.scheduler = scheduler;
    }
}
