import { IWebhooksExtend } from '../../definition/accessors';
import { IWebhook } from '../../definition/webhooks';
import { AppWebhookManager } from '../managers/AppWebhookManager';

export class WebhooksExtend implements IWebhooksExtend {
    constructor(private readonly manager: AppWebhookManager, private readonly appId: string) { }

    public provideWebhook(webhook: IWebhook): Promise<void> {
        return Promise.resolve(this.manager.addWebhook(this.appId, webhook));
    }
}
