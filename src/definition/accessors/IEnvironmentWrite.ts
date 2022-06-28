import { IServerSettingUpdater } from './IServerSettingUpdater';
import { ISettingUpdater } from './ISettingUpdater';

/**
 * Allows write-access to the App's settings,
 */
export interface IEnvironmentWrite {
    getSettings(): ISettingUpdater;
    getServerSettings(): IServerSettingUpdater;
}
