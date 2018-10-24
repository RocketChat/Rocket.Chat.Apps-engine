import { IHttp, IModify, IPersistence, IRead } from '../accessors';
import { IApiEndpointInfo } from './IApiEndpointInfo';
import { IApiExample } from './IApiExample';
import { IApiRequest } from './IRequest';
import { IApiResponse } from './IResponse';

/**
 * Represents an api enpoint that is being provided.
 */
export interface IApiEndpoint {
    /**
     * The final part of the api URL. Example: https://{your-server-address}/api/apps/public/{your-app-id}/{path}
     * or https://{your-server-address}/api/apps/private/{your-app-id}/{private-hash}/{path}
     */
    path: string;
    examples?: {[key: string]: IApiExample};

    /**
     * Called whenever the publically accessible url for this App is called,
     * if you handle the methods differently then split it out so your code doesn't get too big.
     */
    get?(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse>;
    post?(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse>;
    put?(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse>;
    delete?(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse>;
    head?(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse>;
    options?(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse>;
    patch?(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse>;
}
