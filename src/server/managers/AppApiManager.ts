import { AppStatusUtils } from '../../definition/AppStatus';

import { IApi, IApiRequest, IApiResponse } from '../../definition/api';
import { AppManager } from '../AppManager';
import { IAppApiBridge } from '../bridges';
import { PathAlreadyExistsError } from '../errors';
import { AppAccessorManager } from './AppAccessorManager';
import { AppApi } from './AppApi';

/**
 * The api manager for the Apps.
 *
 * An App will add api's during their `initialize` method.
 * Then once an App's `onEnable` is called and it returns true,
 * only then will that App's api's be enabled.
 */
export class AppApiManager {
    private readonly bridge: IAppApiBridge;
    private readonly accessors: AppAccessorManager;
    // Variable that contains the api's which have been provided by apps.
    // The key of the top map is app id and the key of the inner map is the path
    private providedApis: Map<string, Map<string, AppApi>>;

    constructor(private readonly manager: AppManager) {
        this.bridge = this.manager.getBridges().getApiBridge();
        this.accessors = this.manager.getAccessorManager();
        this.providedApis = new Map<string, Map<string, AppApi>>();
    }

    /**
     * Adds an to *be* registered. This will *not register* it with the
     * bridged system yet as this is only called on an App's
     * `initialize` method and an App might not get enabled.
     * When adding an api, it can *not* already exist in the system.
     *
     * @param appId the app's id which the api belongs to
     * @param api the api to add to the system
     */
    public addApi(appId: string, api: IApi): void {
        if (typeof api.path !== 'string') {
            throw new Error('Invalid Api parameter provided, it must be a valid IApi object.');
        }

        // Verify the api's path doesn't exist already
        if (this.providedApis.get(appId) && this.providedApis.get(appId).has(api.path)) {
            throw new PathAlreadyExistsError(api.path);
        }

        const app = this.manager.getOneById(appId);
        if (!app) {
            throw new Error('App must exist in order for an api to be added.');
        }

        if (!this.providedApis.has(appId)) {
            this.providedApis.set(appId, new Map<string, AppApi>());
        }

        this.providedApis.get(appId).set(api.path, new AppApi(app, api));
    }

    /**
     * Registers all of the api's for the provided app inside
     * of the bridged system which then enables them.
     *
     * @param appId The app's id of which to register it's api's with the bridged system
     */
    public registerApis(appId: string): void {
        if (!this.providedApis.has(appId)) {
            return;
        }

        for (const [, apiapp] of this.providedApis.get(appId).entries()) {
            this.registerApi(appId, apiapp);
        }
    }

    /**
     * Unregisters the api's from the system.
     *
     * @param appId the appId for the api's to purge
     */
    public unregisterApis(appId: string): void {
        if (this.providedApis.has(appId)) {
            this.bridge.unregisterApis(appId);

            this.providedApis.delete(appId);
        }
    }

    /**
     * Executes an App's api.
     *
     * @param appId the app which is providing the api
     * @param path the path to be executed in app's api's
     * @param request the request data to be evaluated byt the app
     */
    public executeApi(appId: string, path: string, request: IApiRequest): Promise<IApiResponse> {
        const api = this.providedApis.get(appId).get(path);

        if (!api) {
            return;
        }

        const app = this.manager.getOneById(appId);

        if (!app || AppStatusUtils.isDisabled(app.getStatus())) {
            // Just in case someone decides to do something they shouldn't
            // let's ensure the app actually exists
            return;
        }

        return api.runExecutor(request, this.manager.getLogStorage(), this.accessors);
    }

    /**
     * Return a list of api's for a certain app
     *
     * @param appId the app which is providing the api
     */
    public listApis(appId: string): Array<object> {
        const apis = this.providedApis.get(appId);

        if (!apis) {
            throw new Error('No app found for the provided id.');
        }

        const result = [];

        for (const api of apis.values()) {
            result.push({
                path: api.api.path,
                computedPath: api.computedPath,
                methods: api.implementedMethods,
                examples: api.api.examples,
            });
        }

        return result;
    }

    /**
     * Actually goes and provide's the bridged system with the api information.
     *
     * @param appId the app which is providing the api
     * @param info the api's registration information
     */
    private registerApi(appId: string, api: AppApi): void {
        this.bridge.registerApi(api, appId);
    }
}
