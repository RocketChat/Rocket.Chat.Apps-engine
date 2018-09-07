import { IHttp, IModify, IPersistence, IRead } from '../accessors';
import { IWebhookRequest } from './IRequest';
import { IWebhookResponse } from './IResponse';
import { IWebhookExample } from './IWebhookExample';

/**
 * Represents a webhook that is being provided.
 */
export interface IWebhook {
    /**
     * Path to complete the webhook URL. Example: https://{your-server-address}/api/apps/public/{your-app-id}/{path}
     * or https://{your-server-address}/api/apps/private/{your-app-id}/{private-hash}/{path}
     */
    path: string;
    /**
     * Provides the visibility method of the URL, see the WebhookVisibility descriptions for more information
     */
    visibility: WebhookVisibility;
    /**
     * Provides the visibility method of the URL, see the WebhookSecurity descriptions for more information
     */
    security: WebhookSecurity;
    /**
     * Provide the examples for each method you have implemented, use the `@example` decorator imported
     * from `IWebhookExample` on top of each method to provide this information.
     */
    examples?: {[key: string]: IWebhookExample};

    /**
     * Called whenever the publically accessible url for this App is called,
     * if you handle the methods differently then split it out so your code doesn't get too big.
     */
    get?(request: IWebhookRequest, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IWebhookResponse>;
    post?(request: IWebhookRequest, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IWebhookResponse>;
    put?(request: IWebhookRequest, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IWebhookResponse>;
    delete?(request: IWebhookRequest, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IWebhookResponse>;
    head?(request: IWebhookRequest, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IWebhookResponse>;
    options?(request: IWebhookRequest, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IWebhookResponse>;
    patch?(request: IWebhookRequest, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IWebhookResponse>;
}

export enum WebhookVisibility {
    /**
     * Public webhooks has a fixed URL format, they are easy to remember
     * but they are easy to be hacked as well.
     * We recomend not use `WebhookSecurity.UNSECURE` when keeping it as
     * public.
     * Url format:
     * `https://{your-server-address}/api/apps/public/{your-app-id}/{path}`
     */
    PUBLIC,
    /**
     * Private webhooks has a random part that generates a dynamic URL
     * format, they are more security by default.
     * The dynamic part will be generated on app installation, what means
     * that the URL will chenge only on and for every app installation,
     * on app updates the URL will stay the same, but if the user uninstall
     * and installed later the path will change.
     * Url format:
     * `https://{your-server-address}/api/apps/private/{random-hash}/{your-app-id}/{path}`
     */
    PRIVATE,
}

export enum WebhookSecurity {
    /**
     * No security check will be executed agains the calls made to this URL
     */
    UNSECURE,
    /**
     * Only calls containing a valid token will be able to execute the webhook
     * Mutiple tokens can be generated to access the webhook, by default one
     * will be generated automatically.
     * @param `X-Auth-Token`
     */
    // AUTH_TOKEN,
    // CHECKSUM_SECRET,
}
