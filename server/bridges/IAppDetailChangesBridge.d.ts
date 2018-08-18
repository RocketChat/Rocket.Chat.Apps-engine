import { ISetting } from '../../definition/settings';
/**
 * An interface which will contain various methods related to Apps
 * which are called for various inner detail working changes. This
 * allows for us to notify various external components of internal
 * changes.
 */
export interface IAppDetailChangesBridge {
    onAppSettingsChange(appId: string, setting: ISetting): void;
}
