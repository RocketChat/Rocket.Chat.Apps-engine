import { IWebhook } from '../../../src/definition/webhooks';
import { IAppWebhookBridge } from '../../../src/server/bridges';
import { TestData } from '../utilities';

export class TestsWebhookBridge implements IAppWebhookBridge {
    public webhooks: Map<string, Map<string, IWebhook>>;

    constructor() {
        this.webhooks = new Map<string, Map<string, IWebhook>>();
        this.webhooks.set('appId', new Map<string, IWebhook>());
        this.webhooks.get('appId').set('it-exists', TestData.getWebhook('it-exists'));
    }

    public registerWebhook(webhook: IWebhook, appId: string): void {
        if (!this.webhooks.has(appId)) {
            this.webhooks.set(appId, new Map<string, IWebhook>());
        }

        if (this.webhooks.get(appId).has(webhook.path)) {
            throw new Error(`Webhook "${webhook.path}" has already been registered for app ${appId}.`);
        }

        this.webhooks.get(appId).set(webhook.path, webhook);
    }

    public unregisterWebhooks(appId: string): void {
        this.webhooks.delete(appId);
    }
}
