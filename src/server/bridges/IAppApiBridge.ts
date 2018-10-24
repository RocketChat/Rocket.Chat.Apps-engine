import { AppApi } from '../managers/AppApi';

/**
 * The interface which should be implemented for the api's to be
 * registered and unregistered.
 */
export interface IAppApiBridge {
    /**
     * Registers an api with the system which is being bridged.
     *
     * @param api the api to register
     * @param appId the id of the app calling this
     */
    registerApi(api: AppApi, appId: string): void;

    /**
     * Unregisters all provided api's of an app from the bridged system.
     *
     * @param appId the id of the app calling this
     */
    unregisterApis(appId: string): void;
}
