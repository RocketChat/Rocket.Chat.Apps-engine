import { URL } from 'url';
import { IConfigurationExtend, IHttp, IModify, IPersistence, IRead } from '../../definition/accessors';
import { ApiSecurity, ApiVisibility, IApiEndpointInfo, IApiRequest, IApiResponse } from '../../definition/api';
import { App } from '../../definition/App';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '../../definition/metadata';
import { SettingType } from '../../definition/settings';
import { IUser } from '../../definition/users';

export enum IGrantType {
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
}

export class OAuth2Client {
    constructor(
        private readonly app: App,
        private readonly config: IOAuth2ClientOptions,
    ) {}

    /**
     * Remember to instruct devs to add the i18n strings in ther app.
     */
    public async setup(configuration: IConfigurationExtend) {
        configuration.api.provideApi({
            security: ApiSecurity.UNSECURE,
            visibility: ApiVisibility.PUBLIC,
            endpoints: [
                {
                    path: `${this.config.alias}-callback/`,
                    get: this.handleOAuthCallback.bind(this),
                },
            ],
        });

        await Promise.all([
            configuration.settings.provideSetting({
                id: `${this.config.alias}-oauth-client-id`,
                type: SettingType.STRING,
                public: true,
                required: true,
                packageValue: '61630616441-bub4k41kit4o6fhvedkuceq8r4p03oh1.apps.googleusercontent.com',
                i18nLabel: `${this.config.alias}-oauth-client-id`,
            }),

            configuration.settings.provideSetting({
                id: `${this.config.alias}-oauth-clientsecret`,
                type: SettingType.STRING,
                public: true,
                required: true,
                packageValue: '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',
                i18nLabel: `${this.config.alias}-oauth-client-secret`,
            }),
        ]);
    }

    public async getUserAuthorizationUrl(
        user: IUser,
        scopes?: Array<string>,
    ): Promise<URL> {
        const redirectUri = this.app
            .getAccessors()
            .providedApiEndpoints[0].computedPath.substring(1);

        const siteUrl = await this.app
            .getAccessors()
            .environmentReader.getServerSettings()
            .getValueById('Site_Url');

        const finalScopes = ([] as Array<string>).concat(
            this.config.defaultScopes || [],
            scopes || [],
        );

        const authUri = this.config.authUri;

        const clientId = await this.app
            .getAccessors()
            .reader.getEnvironmentReader()
            .getSettings()
            .getValueById(`${this.config.alias}-oauth-client-id`);

        const url = new URL(authUri, siteUrl);

        url.searchParams.set('response_type', 'code');
        url.searchParams.set('redirect_uri', `${siteUrl}${redirectUri}`);
        url.searchParams.set('state', user.id);
        url.searchParams.set('client_id', clientId);
        url.searchParams.set('access_type', 'offline');

        if (finalScopes.length > 0) {
            url.searchParams.set('scope', finalScopes.join(' '));
        }

        return url;
    }

    public async getAccessTokenForUser(user: IUser): Promise<Array<IAuthData>> {
        const associations = [
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.USER,
                user.id,
            ),
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC,
                `${this.config.alias}-oauth-connection`,
            ),
        ];

        return this.app
            .getAccessors()
            .reader.getPersistenceReader()
            .readByAssociations(associations) as unknown as Array<IAuthData>;
    }

    public async handleOAuthCallback(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence,
    ): Promise<IApiResponse> {
        try {
            const siteUrl = await this.app
                .getAccessors()
                .environmentReader.getServerSettings()
                .getValueById('Site_Url');
            const accessTokenUrl = this.config.accessTokenUri;
            const redirectUri = this.app
                .getAccessors()
                .providedApiEndpoints[0].computedPath.substring(1);

            const clientId = await this.app
                .getAccessors()
                .reader.getEnvironmentReader()
                .getSettings()
                .getValueById(`${this.config.alias}-oauth-client-id`);

            const clientSecret = await this.app
                .getAccessors()
                .reader.getEnvironmentReader()
                .getSettings()
                .getValueById(`${this.config.alias}-oauth-clientsecret`);

            const {
                query: { code, state },
            } = request;

            const url = new URL(accessTokenUrl, siteUrl);

            url.searchParams.set('client_id', clientId);
            url.searchParams.set('redirect_uri', `${siteUrl}${redirectUri}`);
            url.searchParams.set('code', code);
            url.searchParams.set('client_secret', clientSecret);
            url.searchParams.set('access_type', 'offline');
            url.searchParams.set('grant_type', IGrantType.AuthorizationCode);

            const { content, statusCode } = await http.post(url.href, {
                headers: { Accept: 'application/json' },
            });

            const { access_token, expires_in, refresh_token } = JSON.parse(
                content as string,
            );

            if (!access_token) {
                return {
                    status: statusCode,
                    content: '<div style="display: flex;align-items: center;justify-content: center; height: 100%;">\
                                <h1 style="text-align: center; font-family: Helvetica Neue;">\
                                    Oops, something went wrong, please try again or in case it still does not work, contact the administrator.\
                                </h1>\
                            </div>',
                };
            }

            this.saveToken({
                token: access_token,
                expiresAt: expires_in,
                refreshToken: refresh_token,
                userId: state,
                persis,
            });

            return {
                status: statusCode,
                content: '<div style="display: flex;align-items: center;justify-content: center; height: 100%;">\
                            <h1 style="text-align: center; font-family: Helvetica Neue;"> Authentication went successfully </br>\
                                You can close this tab now.\
                            </h1>\
                        </div>',
            };
        } catch (error) {
            this.app.getLogger().error(error);
            return {
                status: 500,
            };
        }
    }

    public async refreshUserAccessToken({
        user,
        persis,
    }: {
        user: IUser,
        persis: IPersistence,
    }) {
        try {
            const {
                config: { refreshTokenUri },
            } = this;

            const clientId = await this.app
                .getAccessors()
                .reader.getEnvironmentReader()
                .getSettings()
                .getValueById(`${this.config.alias}-oauth-client-id`);

            const clientSecret = await this.app
                .getAccessors()
                .reader.getEnvironmentReader()
                .getSettings()
                .getValueById(`${this.config.alias}-oauth-clientsecret`);

            const siteUrl = await this.app
                    .getAccessors()
                    .environmentReader.getServerSettings()
                    .getValueById('Site_Url');
            const redirectUri = this.app
                    .getAccessors()
                    .providedApiEndpoints[0].computedPath.substring(1);
            const url = new URL(refreshTokenUri);

            const tokensInfo = await this.getAccessTokenForUser(user);

            for (const tokenInfo of tokensInfo) {
                if (tokenInfo.refreshToken) {
                    url.searchParams.set('client_id', clientId);
                    url.searchParams.set('redirect_uri', `${siteUrl}${redirectUri}`);
                    url.searchParams.set('refresh_token', tokenInfo.refreshToken);
                    url.searchParams.set('client_secret', clientSecret);
                    url.searchParams.set('grant_type', IGrantType.RefreshToken);

                    const { content } = await this.app.getAccessors().http.post(url.href);

                    const { access_token, expires_in, refresh_token } = JSON.parse(
                        content as string,
                    );

                    if (access_token) {
                        await this.removeToken({ userId: user.id, persis }),
                        await this.saveToken({
                            token: access_token,
                            expiresAt: expires_in,
                            refreshToken: refresh_token,
                            userId: user.id,
                            persis,
                        });
                    }
                }
            }
        } catch (error) {
            this.app.getLogger().error(error);
        }

    }

    public async revokeUserAccessToken({ user, persis }: { user: IUser, persis: IPersistence}) {
        const tokensInfo = await this.getAccessTokenForUser(user);

        const url = new URL(this.config.revokeTokenURI);

        for (const tokenInfo of tokensInfo) {
            url.searchParams.set('token', tokenInfo.token);

            await this.app.getAccessors().http.post(url.href);
        }

        this.removeToken({ userId: user.id, persis });

    }

    private async saveToken({
        token,
        expiresAt,
        refreshToken,
        userId,
        persis,
    }: {
        token: string,
        expiresAt: number,
        refreshToken: string,
        userId: string,
        persis: IPersistence,
    }) {
        await persis.createWithAssociations(
            {
                token,
                expiresAt: expiresAt || '',
                refreshToken: refreshToken || '',
            },
            [
                new RocketChatAssociationRecord(
                    RocketChatAssociationModel.USER,
                    userId,
                ),
                new RocketChatAssociationRecord(
                    RocketChatAssociationModel.MISC,
                    `${this.config.alias}-oauth-connection`,
                ),
            ],
        );
    }

    private async removeToken({ userId, persis }: { userId: string, persis: IPersistence} ) {
        await persis.removeByAssociations([
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.USER,
                userId,
            ),
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC,
                `${this.config.alias}-oauth-connection`,
            ),
        ]);
    }
}
