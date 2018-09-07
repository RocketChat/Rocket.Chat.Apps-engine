import { AppStatusUtils } from '../../definition/AppStatus';

import { IWebhook, IWebhookRequest, IWebhookResponse } from '../../definition/webhooks';
import { AppManager } from '../AppManager';
import { IAppWebhookBridge } from '../bridges';
import { PathAlreadyExistsError } from '../errors';
import { AppAccessorManager } from './AppAccessorManager';
import { AppWebhook } from './AppWebhook';

/**
 * The webhook manager for the Apps.
 *
 * An App will add webhooks during their `initialize` method.
 * Then once an App's `onEnable` is called and it returns true,
 * only then will that App's webhooks be enabled.
 */
export class AppWebhookManager {
    private readonly bridge: IAppWebhookBridge;
    private readonly accessors: AppAccessorManager;
    // Variable that contains the webhooks which have been provided by apps.
    // The key of the top map is app id and the key of the inner map is the path
    private providedWebhooks: Map<string, Map<string, AppWebhook>>;

    constructor(private readonly manager: AppManager) {
        this.bridge = this.manager.getBridges().getWebhookBridge();
        this.accessors = this.manager.getAccessorManager();
        this.providedWebhooks = new Map<string, Map<string, AppWebhook>>();
    }

    /**
     * Adds a webhook to *be* registered. This will *not register* it with the
     * bridged system yet as this is only called on an App's
     * `initialize` method and an App might not get enabled.
     * When adding a webhook, it can *not* already exist in the system.
     *
     * @param appId the app's id which the webhook belongs to
     * @param webhook the webhook to add to the system
     */
    public addWebhook(appId: string, webhook: IWebhook): void {
        if (typeof webhook.path !== 'string') {
            throw new Error('Invalid Webhook parameter provided, it must be a valid IWebhook object.');
        }

        // Verify the webhook's path doesn't exist already
        if (this.providedWebhooks.get(appId) && this.providedWebhooks.get(appId).has(webhook.path)) {
            throw new PathAlreadyExistsError(webhook.path);
        }

        const app = this.manager.getOneById(appId);
        if (!app) {
            throw new Error('App must exist in order for a webhook to be added.');
        }

        if (!this.providedWebhooks.has(appId)) {
            this.providedWebhooks.set(appId, new Map<string, AppWebhook>());
        }

        this.providedWebhooks.get(appId).set(webhook.path, new AppWebhook(app, webhook));
    }

    /**
     * Registers all of the webhooks for the provided app inside
     * of the bridged system which then enables them.
     *
     * @param appId The app's id of which to register it's webhooks with the bridged system
     */
    public registerWebhooks(appId: string): void {
        if (!this.providedWebhooks.has(appId)) {
            return;
        }

        for (const [, webhookapp] of this.providedWebhooks.get(appId).entries()) {
            this.registerWebhook(appId, webhookapp);
        }
    }

    /**
     * Unregisters the webhooks from the system.
     *
     * @param appId the appId for the webhooks to purge
     */
    public unregisterWebhooks(appId: string): void {
        if (this.providedWebhooks.has(appId)) {
            this.bridge.unregisterWebhooks(appId);

            this.providedWebhooks.delete(appId);
        }
    }

    /**
     * Executes an App's webhook.
     *
     * @param appId the app which is providing the webhook
     * @param path the path to be executed in app's webhooks
     * @param request the request data to be evaluated byt the app
     */
    public executeWebhook(appId: string, path: string, request: IWebhookRequest): Promise<IWebhookResponse> {
        const webhook = this.providedWebhooks.get(appId).get(path);

        if (!webhook) {
            return;
        }

        const app = this.manager.getOneById(appId);

        if (!app || AppStatusUtils.isDisabled(app.getStatus())) {
            // Just in case someone decides to do something they shouldn't
            // let's ensure the app actually exists
            return;
        }

        return webhook.runExecutor(request, this.manager.getLogStorage(), this.accessors);
    }

    /**
     * Actually goes and provide's the bridged system with the webhook information.
     *
     * @param appId the app which is providing the webhook
     * @param info the webhook's registration information
     */
    private registerWebhook(appId: string, webhook: AppWebhook): void {
        this.bridge.registerWebhook(webhook, appId);
    }
}
