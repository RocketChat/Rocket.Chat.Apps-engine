import { IConfigurationExtend, IHttpExtend, ISettingsExtend, ISlashCommandsExtend } from '../../definition/accessors';
export declare class ConfigurationExtend implements IConfigurationExtend {
    readonly http: IHttpExtend;
    readonly settings: ISettingsExtend;
    readonly slashCommands: ISlashCommandsExtend;
    constructor(https: IHttpExtend, sets: ISettingsExtend, cmds: ISlashCommandsExtend);
}
