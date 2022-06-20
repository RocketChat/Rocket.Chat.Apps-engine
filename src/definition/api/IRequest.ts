import { RequestMethod } from '../accessors';
import { IUser } from '../users';

export interface IApiRequest {
    method: RequestMethod;
    headers: { [key: string]: string };
    query: { [key: string]: string };
    params: { [key: string]: string };
    content: any;
    privateHash?: string;
    /**
     * The user that is making the request.
     * Available if the endpoint has property
     * `authRequired` set to `true`.
     */
    user?: IUser;
}
