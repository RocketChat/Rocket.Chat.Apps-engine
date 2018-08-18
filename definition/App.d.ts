import { IConfigurationExtend, IConfigurationModify, IEnvironmentRead, IHttp, ILogger, IRead } from './accessors';
import { AppStatus } from './AppStatus';
import { IApp } from './IApp';
import { IAppAuthorInfo } from './metadata/IAppAuthorInfo';
import { IAppInfo } from './metadata/IAppInfo';
import { ISetting } from './settings';
export declare abstract class App implements IApp {
    private readonly info;
    private readonly logger;
    private status;
    /**
     * Create a new App, this is called whenever the server starts up and initiates the Apps.
     * Note, your implementation of this class should call `super(name, id, version)` so we have it.
     * Also, please use the `initialize()` method to do items instead of the constructor as the constructor
     * *might* be called more than once but the `initialize()` will only be called once.
     */
    protected constructor(info: IAppInfo, logger: ILogger);
    getStatus(): AppStatus;
    /**
     * Get the name of this App.
     *
     * @return {string} the name
     */
    getName(): string;
    /**
     * Gets the sluggified name of this App.
     *
     * @return {string} the name slugged
     */
    getNameSlug(): string;
    /**
     * Get the ID of this App, please see <link> for how to obtain an ID for your App.
     *
     * @return {number} the ID
     */
    getID(): string;
    /**
     * Get the version of this App, using http://semver.org/.
     *
     * @return {string} the version
     */
    getVersion(): string;
    /**
     * Get the description of this App, mostly used to show to the clients/administrators.
     *
     * @return {string} the description
     */
    getDescription(): string;
    /**
     * Gets the API Version which this App depends on (http://semver.org/).
     * This property is used for the dependency injections.
     *
     * @return {string} the required api version
     */
    getRequiredApiVersion(): string;
    /**
     * Gets the information regarding the author/maintainer of this App.
     *
     * @return author information
     */
    getAuthorInfo(): IAppAuthorInfo;
    /**
     * Gets the entirity of the App's information.
     *
     * @return App information
     */
    getInfo(): IAppInfo;
    /**
     * Gets the ILogger instance for this App.
     *
     * @return the logger instance
     */
    getLogger(): ILogger;
    /**
     * Method which will be called when the App is initialized. This is the recommended place
     * to add settings and slash commands. If an error is thrown, all commands will be unregistered.
     */
    initialize(configurationExtend: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void>;
    /**
     * Method which is called when this App is enabled and can be called several
     * times during this instance's life time. Once after the `ititialize()` is called,
     * pending it doesn't throw an error, and then anytime the App is enabled by the user.
     * If this method, `onEnable()`, returns false, then this App will not
     * actually be enabled (ex: a setting isn't configured).
     *
     * @return whether the App should be enabled or not
     */
    onEnable(environment: IEnvironmentRead, configurationModify: IConfigurationModify): Promise<boolean>;
    /**
     * Method which is called when this App is disabled and it can be called several times.
     * If this App was enabled and then the user disabled it, this method will be called.
     */
    onDisable(configurationModify: IConfigurationModify): Promise<void>;
    /**
     * Method which is called whenever a setting which belongs to this App has been updated
     * by an external system and not this App itself. The setting passed is the newly updated one.
     *
     * @param setting the setting which was updated
     * @param configurationModify the accessor to modifiy the system
     * @param reader the reader accessor
     * @param http an accessor to the outside world
     */
    onSettingUpdated(setting: ISetting, configurationModify: IConfigurationModify, read: IRead, http: IHttp): Promise<void>;
    /**
     * Method will be called during initialization. It allows for adding custom configuration options and defaults
     * @param configuration
     */
    protected extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void>;
    /**
     * Sets the status this App is now at, use only when 100% true (it's protected for a reason).
     *
     * @param status the new status of this App
     */
    protected setStatus(status: AppStatus): Promise<void>;
}
