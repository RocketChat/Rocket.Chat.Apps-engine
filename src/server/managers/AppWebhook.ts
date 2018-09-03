import { AppMethod } from '../../definition/metadata';

import { IWebhook, IWebhookRequest, IWebhookResponse } from '../../definition/webhooks';
import { ProxiedApp } from '../ProxiedApp';
import { AppLogStorage } from '../storage';
import { AppAccessorManager } from './AppAccessorManager';

export class AppWebhook {
    constructor(public app: ProxiedApp, public webhook: IWebhook) {

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

        let result: Promise<IWebhookResponse>;
        try {
            const runCode = `webhook.${ method }.apply(webhook, args)`;
            result = await this.app.runInContext(runCode, runContext);
            logger.debug(`${ path }'s ${ method } was successfully executed.`);
        } catch (e) {
            logger.error(e);
            logger.debug(`${ path }'s ${ method } was unsuccessful.`);
        }

        try {
            await logStorage.storeEntries(this.app.getID(), logger);
        } catch (e) {
            // Don't care, at the moment.
            // TODO: Evaluate to determine if we do care
        }

        return result;
    }
}
