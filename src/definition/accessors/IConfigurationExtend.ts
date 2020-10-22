import { IApiExtend } from './IApiExtend';
import { IExternalComponentsExtend } from './IExternalComponentsExtend';
import { IHttpExtend } from './IHttp';
import { ISchedulerExtend } from './ISchedulerExtend';
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

    /** Accessor for declaring api endpoints. */
    readonly api: IApiExtend;

    readonly externalComponents: IExternalComponentsExtend;

    /** Accessor for declaring tasks that can be scheduled (like cron) */
    readonly scheduler: ISchedulerExtend;
}
