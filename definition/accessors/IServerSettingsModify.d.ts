import { ISetting } from '../settings';
/**
 * This accessor provides methods to change default setting options
 * of Rocket.Chat in a compatible way. It is provided during
 * your App's "onEnable".
 */
export interface IServerSettingsModify {
    /**
     * Hides an existing settings group.
     *
     * @param name The technical name of the group
     */
    hideGroup(name: string): Promise<void>;
    /**
     * Hides a setting. This does not influence the actual functionality (the setting will still
     * have its value and can be programatically read), but the administrator will not be able to see it anymore
     *
     * @param id the id of the setting to hide
     */
    hideSetting(id: string): Promise<void>;
    /**
     * Modifies the configured value of another setting, please use it with caution as an invalid
     * setting configuration could cause a Rocket.Chat instance to become unstable.
     *
     * @param setting the modified setting (id must be provided)
     */
    modifySetting(setting: ISetting): Promise<void>;
}
