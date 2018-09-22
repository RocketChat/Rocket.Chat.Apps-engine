import { IHttp, IModify, IPersistence, IRead } from '../accessors';
import { IApiEndpointInfo } from './IApiEndpointInfo';
import { IApiExample } from './IApiExample';
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
     * A public Api has a fixed format for a url. Using it enables an
     * easy to remember structure, however, it also means the url is
     * intelligently guessed. As a result, we recommend having some
     * sort of security setup if you must have a public api.Whether
     * you use the provided security, ApiSecurity, or implement your own.
     * Url format:
     * `https://{your-server-address}/api/apps/public/{your-app-id}/{path}`
     */
    PUBLIC,
    /**
     * Private Api's contain a random value in the url format,
     * making them harder go guess by default. The random value
     * will be generated whenever the App is installed on a server.
     * This means that the URL will not be the same on any server,
     * but will remain the same throughout the lifecycle of an App
     * including updates. As a result, if a user uninstalls the App
     * and reinstalls the App, then the random value will change.
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
