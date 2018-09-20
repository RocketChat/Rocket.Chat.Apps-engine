import { HttpStatusCode } from '../accessors';

export interface IApiResponse {
    status: HttpStatusCode;
    headers?: { [key: string]: string };
    content?: any;
}
