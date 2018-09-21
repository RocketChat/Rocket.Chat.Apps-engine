import { IHttp, IModify, IPersistence, IRead } from '../accessors';
import { IApiExample } from './IApiExample';
import { IApiEndpointInfo } from './IEndpoint';
import { IApiRequest } from './IRequest';
import { IApiResponse } from './IResponse';

export interface IApiEndpoint {
    /**
     * Path to complete the api URL. Example: https://{your-server-address}/api/apps/public/{your-app-id}/{path}
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

/**
 * Represents an api that is being provided.
 */
export interface IApi {
    /**
     * Provides the visibility method of the URL, see the ApiVisibility descriptions for more information
     */
    visibility: ApiVisibility;
    /**
     * Provides the visibility method of the URL, see the ApiSecurity descriptions for more information
     */
    security: ApiSecurity;
    /**
     * Provide enpoints for this api registry
     */
    endpoints: Array<IApiEndpoint>;
}

export enum ApiVisibility {
    /**
     * Public api's have a fixed URL format, they are easy to remember
     * but they are easy to be hacked as well.
     * We recomend not use `ApiSecurity.UNSECURE` when keeping it as
     * public.
     * Url format:
     * `https://{your-server-address}/api/apps/public/{your-app-id}/{path}`
     */
    PUBLIC,
    /**
     * Private api's have a random part that generates a dynamic URL
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

export enum ApiSecurity {
    /**
     * No security check will be executed agains the calls made to this URL
     */
    UNSECURE,
    /**
     * Only calls containing a valid token will be able to execute the api
     * Mutiple tokens can be generated to access the api, by default one
     * will be generated automatically.
     * @param `X-Auth-Token`
     */
    // AUTH_TOKEN,
    // CHECKSUM_SECRET,
}
