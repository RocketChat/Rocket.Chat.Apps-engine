import { RequestMethod } from '../accessors';

export interface IApiRequest {
    method: RequestMethod;
    headers: { [key: string]: string };
    query: { [key: string]: string };
    params: { [key: string]: string };
    content: any;
    privateHash?: string;
}
