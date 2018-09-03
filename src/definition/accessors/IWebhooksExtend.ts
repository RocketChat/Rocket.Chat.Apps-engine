import { IWebhook } from '../webhooks';

/**
 * This accessor provides methods for adding custom webhooks.
 * It is provided during the initialization of your App
 */

export interface IWebhooksExtend {
    /**
     * Adds a webhook which can be called by external services lateron.
     * Should a webhook already exists an error will be thrown.
     *
     * @param webhook the command information
     */
    provideWebhook(webhook: IWebhook): Promise<void>;
}
