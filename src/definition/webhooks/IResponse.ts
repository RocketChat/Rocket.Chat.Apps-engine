import { HttpStatusCode } from '../accessors';

export interface IWebhookResponse {
    status: HttpStatusCode;
    headers?: { [key: string]: string };
    content?: any;
}
