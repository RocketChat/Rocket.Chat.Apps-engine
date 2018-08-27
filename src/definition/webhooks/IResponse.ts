import { HttpStatusCode } from '../accessors';

export interface IWebhookResponse {
    status: HttpStatusCode;
    content?: any;
}
