import { IOAuthAppParams, IOAuthAppsModify } from '../../definition/accessors/IOAuthAppsModify';
import { OAuthAppsBridge } from '../bridges/OAuthAppsBridge';

export class OAuthAppsModify implements IOAuthAppsModify {
    constructor(
        private readonly oauthAppsBridge: OAuthAppsBridge,
        private readonly appId: string,
    ) {}

    public async createOAuthApp(OAuthApp: IOAuthAppParams): Promise<string> {
        return this.oauthAppsBridge.doCreate(OAuthApp, this.appId);
    }

    public async updateOAuthApp(OAuthApp: IOAuthAppParams, id: string): Promise<void> {
        return this.oauthAppsBridge.doUpdate(OAuthApp, id, this.appId);
    }

    public async deleteOAuthApp(id: string): Promise<void> {
        return this.oauthAppsBridge.doDelete(id, this.appId);
    }
}
