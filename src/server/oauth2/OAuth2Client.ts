import { IConfigurationExtend, IHttp, IModify, IPersistence, IRead } from '../../definition/accessors';
import { ApiSecurity, ApiVisibility, IApiEndpointInfo, IApiRequest, IApiResponse } from '../../definition/api';
import { App } from '../../definition/App';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '../../definition/metadata';
import { SettingType } from '../../definition/settings';
import { IUser } from '../../definition/users';

export interface IOAuth2ClientOptions {
    alias: string;
    clientId: string;
    clientSecret: string;
    defaultScopes?: Array<string>;
}

export class OAuth2Client {
    constructor(private readonly app: App, private readonly config: IOAuth2ClientOptions) { }

    public async setup(configuration: IConfigurationExtend) {
        configuration.api.provideApi({
            security: ApiSecurity.UNSECURE,
            visibility: ApiVisibility.PUBLIC,
            endpoints: [{
                path: `/${this.config.alias}-callback`,
                get: this.handleOAuthCallback.bind(this),
            }],
        });

        await configuration.settings.provideSetting({
            id: `${this.config.alias}-oauth-client-id`,
            type: SettingType.STRING,
            public: true,
            required: true,
            packageValue: '',
            i18nLabel: `${this.config.alias}-oauth-client-id`,
        });

        await configuration.settings.provideSetting({
            id: `${this.config.alias}-oauth-clientsecret`,
            type: SettingType.STRING,
            public: true,
            required: true,
            packageValue: '',
            i18nLabel: `${this.config.alias}-oauth-client-secret`,
        });
    }

    public async getUserAuthorizationUrl(user: IUser, scopes?: Array<string>): Promise<URL> {
        const redirectUri = this.app.getAccessors().providedApiEndpoints[0].computedPath;
        const siteUrl = await this.app.getAccessors().environmentReader.getServerSettings().getValueById('Site_Url');
        const finalScopes = ([] as Array<string>).concat(this.config.defaultScopes || [], scopes || []);

        const url = new URL(this.config.accessTokenUri, siteUrl);

        url.searchParams.set('response_type', 'code');
        url.searchParams.set('redirect_uri', `${siteUrl}${redirectUri}`);
        url.searchParams.set('state', user.id);

        if (finalScopes.length > 0) {
            url.searchParams.set('scope', finalScopes.join(' '));
        }

        return url;
    }

    public async getAccessTokenForUser(user: IUser) {

    }

    public async handleOAuthCallback(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence,
    ): Promise<IApiResponse> {
        persis.createWithAssociations({
            token: 'asdkajsdhkjasd',
            expiresAt: 19001239120,
            refreshToken: 'sdjadhakjdhkahdkajshd',
        }, [
            // How do we find user ID? Via `state` query param?
            new RocketChatAssociationRecord(RocketChatAssociationModel.USER, 'asldkasdklajsd'),
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'asldkasdklajsd'),
        ]);

        return {
            status: 200,
        };
    }
}
