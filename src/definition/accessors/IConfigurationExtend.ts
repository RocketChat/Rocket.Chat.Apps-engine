import { IHttpExtend } from './IHttp';
import { ISettingsExtend } from './ISettingsExtend';
import { ISlashCommandsExtend } from './ISlashCommandsExtend';

/**
 * This accessor provides methods for declaring the configuration
 * of your App. It is provided during initialization of your App.
 */
export interface IConfigurationExtend {
    /** Accessor for customing the handling of IHttp requests and responses your App causes. */
    readonly http: IHttpExtend;

    /** Accessor for declaring the settings your App provides. */
    readonly settings: ISettingsExtend;

    /** Accessor for declaring the commands which your App provides. */
    readonly slashCommands: ISlashCommandsExtend;
}
