import {
    IConfigurationExtend,
    ISettingsExtend,
    ISlashCommandsExtend,
} from 'temporary-rocketlets-ts-definition/accessors';

export class ConfigurationExtend implements IConfigurationExtend {
    public readonly settings: ISettingsExtend;
    public readonly slashCommands: ISlashCommandsExtend;

    constructor(sets: ISettingsExtend, cmds: ISlashCommandsExtend) {
        this.settings = sets;
        this.slashCommands = cmds;
    }
}
