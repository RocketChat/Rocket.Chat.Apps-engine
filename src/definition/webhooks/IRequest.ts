import { RequestMethod } from '../accessors';

export interface IWebhookRequest {
    method: RequestMethod;
    headers: { [key: string]: string };
    params: { [key: string]: string };
    content: any;
}
