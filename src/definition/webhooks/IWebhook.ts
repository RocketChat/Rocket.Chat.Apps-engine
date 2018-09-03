import { IHttp, IModify, IPersistence, IRead } from '../accessors';
import { IWebhookRequest } from './IRequest';
import { IWebhookResponse } from './IResponse';

/**
 * Represents a webhook that is being provided.
 */
export interface IWebhook {
    /** Path to complete the webhook URL. Example: https://{your-server-address}/api/apps/{your-app-id}/{path} */
    path: string;
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
