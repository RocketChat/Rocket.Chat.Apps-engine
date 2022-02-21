import { IHttp, IModify, IPersistence, IRead } from '../accessors';
import { IUser } from '../users/IUser';

export enum GrantType {
    RefreshToken =  'refresh_token',
    AuthorizationCode =  'authorization_code',
}

export interface IAuthData {
    token: string;
    expiresAt: number;
    refreshToken: string;
}

export interface IOAuth2ClientOptions {
    /**
     * Alias for the client. This is used to identify the client's resources.
     *
     * It is used to avoid overwriting other clients' settings or endpoints
     * when there are multiple.
     *
     */
    alias: string;
    // Default scopes to be used when requesting access
    defaultScopes?: Array<string>;
    // Access token URI
    accessTokenUri: string;
    // Authorization URI
    authUri: string;
    // Refresh token URI
    refreshTokenUri: string;
    // Revoke token URI
    revokeTokenURI: string;

    callback: (
        token: IAuthData,
        user: IUser,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence,
    ) => { responseContent: string };
}
