import { IServerSettingsModify } from './IServerSettingsModify';
import { ISlashCommandsModify } from './ISlashCommandsModify';

/**
 * This accessor provides methods for modifying the configuration
 * of Rocket.Chat. It is provided during "onEnable" of your App.
 */
export interface IConfigurationModify {
    /** Accessor for modifying the settings inside of Rocket.Chat. */
    readonly serverSettings: IServerSettingsModify;

    /** Accessor for modifying the slash commands inside of Rocket.Chat. */
    readonly slashCommands: ISlashCommandsModify;
}
