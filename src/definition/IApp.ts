import { ILogger } from './accessors/ILogger';
import { AppStatus } from './AppStatus';
import { IAppAuthorInfo } from './metadata/IAppAuthorInfo';
import { IAppInfo } from './metadata/IAppInfo';

export interface IApp {
    /**
     * Gets the status of this App.
     *
     * @return {AppStatus} the status/state of the App
     */
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
}
