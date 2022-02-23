import { IConfigurationExtend, IHttp, IModify, IPersistence, IRead } from '../accessors';
import { IApiEndpointInfo, IApiResponse } from '../api';
import { IApiRequest } from '../api/IRequest';
import { IUser } from '../users/IUser';

export enum GrantType {
    RefreshToken =  'refresh_token',
    AuthorizationCode =  'authorization_code',
}

/**
 * @typedef IAuthData
 * @prop {string} token - Token generated from the authentication
 * @prop {number} expiresAt - This is the token's expiration time in seconds
 * @prop {string} refreshToken - This is the token that will be used to refresh the user's token
 */
export interface IAuthData {
    token: string;
    expiresAt: number;
    refreshToken: string;
}
/**
 * @typedef IOAuth2ClientOptions
 * @prop {string} alias - Alias for the client. This is used to identify the client's resources.
 * It is used to avoid overwriting other clients' settings or endpoints
 * when there are multiple.
 * @prop {string[]} defaultScopes - Default scopes to be used when requesting access
 * @prop {string} accessTokenUri - Access token URI
 * @prop {string} authUri - Authorization URI
 * @prop {string} refreshTokenUri - Refresh token authUri
 * @prop {string} revokeTokenUri - Revoke token URI
 */

/** @type {IOAuth2ClientOptions} */
export interface IOAuth2ClientOptions {
    alias: string;
    defaultScopes?: Array<string>;
    accessTokenUri: string;
    authUri: string;
    refreshTokenUri: string;
    revokeTokenUri: string;

    callback: (
        token: IAuthData,
        user: IUser,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence,
    ) => { responseContent: string };
}

export interface IOAuth2Client {
    /**
     * This method will set all necessary configuration and settings for the client
     * @param configuration - Configuration extend to set all settings and API endpoints
     */
    setup(configuration: IConfigurationExtend): Promise<void>;

    /**
     * @param user - User to authenticate
     * @param {string[]} scopes - Scopes that your app need access
     */
    getUserAuthorizationUrl(
        user: IUser,
        scopes?: Array<string>,
    ): Promise<URL>;

    /**
     * This method will return the authorization token
     * @param user - User to authenticate
     */
    getAccessTokenForUser(user: IUser): Promise<Array<IAuthData>>;

    /**
     * This method will handle the authorization based on the access token URI provided
     * @param request - Request information
     * @param endpoint - Endpoint information
     * @param read - Read accessor
     * @param modify - Modify accessor
     * @param http - HTTP package
     * @param persis - Persistence accessor
     */
    handleOAuthCallback(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence,
    ): Promise<IApiResponse>;

    /**
     * This method will use the refresh token to re-authenticate the user
     * @param {object} - This object must contain the user and persistence accessor
     */
    refreshUserAccessToken({
        user,
        persis,
    }: {
        user: IUser,
        persis: IPersistence,
    }): Promise<boolean>;

    /**
     * This method will revoke the access token and delete it on the persistence
     * @param {object} - This object must contain the user and persistence accessor
     */
    revokeUserAccessToken({
        user,
        persis,
    }: {
        user: IUser,
        persis: IPersistence,
    }): Promise<IAuthData | object>;
}
