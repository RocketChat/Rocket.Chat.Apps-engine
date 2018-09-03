import { IWebhook } from '../../definition/webhooks';

/**
 * The interface which should be implemented for the webhooks to be
 * registered and unregistered.
 */
export interface IAppWebhookBridge {
    /**
     * Registers a webhook with the system which is being bridged.
     *
     * @param webhook the webhook to register
     * @param appId the id of the app calling this
     */
    registerWebhook(webhook: IWebhook, appId: string): void;

    /**
     * Unregisters all provided webhooks of an app from the bridged system.
     *
     * @param appId the id of the app calling this
     */
    unregisterWebhooks(appId: string): void;
}
