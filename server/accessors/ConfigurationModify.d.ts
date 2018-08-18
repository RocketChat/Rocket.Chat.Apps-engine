import { IConfigurationModify, IServerSettingsModify, ISlashCommandsModify } from '../../definition/accessors';
export declare class ConfigurationModify implements IConfigurationModify {
    readonly serverSettings: IServerSettingsModify;
    readonly slashCommands: ISlashCommandsModify;
    constructor(sets: IServerSettingsModify, cmds: ISlashCommandsModify);
}
