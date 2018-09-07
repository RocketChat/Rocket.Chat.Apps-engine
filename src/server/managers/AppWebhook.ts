import { AppMethod } from '../../definition/metadata';

import { IWebhook, IWebhookRequest, IWebhookResponse, WebhookSecurity, WebhookVisibility } from '../../definition/webhooks';
import { ProxiedApp } from '../ProxiedApp';
import { AppLogStorage } from '../storage';
import { AppAccessorManager } from './AppAccessorManager';

export class AppWebhook {
    public readonly computedPath: string;
    constructor(public app: ProxiedApp, public webhook: IWebhook) {
        switch (this.webhook.visibility) {
            case WebhookVisibility.PUBLIC:
                this.computedPath = `/apps/public/${app.getID()}/${webhook.path}`;
                break;

            case WebhookVisibility.PRIVATE:
                this.computedPath = `/apps/private/${app.getID()}/${app.getStorageItem()._id}/${webhook.path}`;
                break;
        }

    }

    public async runExecutor(request: IWebhookRequest,
                             logStorage: AppLogStorage,
                             accessors: AppAccessorManager): Promise<IWebhookResponse> {

        const { path } = this.webhook;

        const method = request.method;

        // Ensure the webhook has the property before going on
        if (typeof this.webhook[method] !== 'function') {
            return;
        }

        if (!this.validateVisibility(request)) {
            return {
                status: 404,
            };
        }

        if (!this.validateSecurity(request)) {
            return {
                status: 401,
            };
        }

        const runContext = this.app.makeContext({
            webhook: this.webhook,
            args: [
                request,
                accessors.getReader(this.app.getID()),
                accessors.getModifier(this.app.getID()),
                accessors.getHttp(this.app.getID()),
                accessors.getPersistence(this.app.getID()),
            ],
        });

        const logger = this.app.setupLogger(AppMethod._WEBHOOK_EXECUTOR);
        logger.debug(`${ path }'s ${ method } is being executed...`, request);

        const runCode = `webhook.${ method }.apply(webhook, args)`;
        try {
            const result: IWebhookResponse = await this.app.runInContext(runCode, runContext);
            logger.debug(`${ path }'s ${ method } was successfully executed.`);
            logStorage.storeEntries(this.app.getID(), logger);
            return result;
        } catch (e) {
            logger.error(e);
            logger.debug(`${ path }'s ${ method } was unsuccessful.`);
            logStorage.storeEntries(this.app.getID(), logger);
            throw e;
        }
    }

    private validateVisibility(request: IWebhookRequest): boolean {
        if (this.webhook.visibility === WebhookVisibility.PUBLIC) {
            return true;
        }

        if (this.webhook.visibility === WebhookVisibility.PRIVATE) {
            return this.app.getStorageItem()._id === request.privateHash;
        }

        return false;
    }

    private validateSecurity(request: IWebhookRequest): boolean {
        if (this.webhook.security === WebhookSecurity.UNSECURE) {
            return true;
        }

        return false;
    }
}
