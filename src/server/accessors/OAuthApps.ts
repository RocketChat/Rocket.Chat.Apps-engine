import { IOAuthApp, IOAuthApps } from '../../definition/accessors/IOAuthApps';
import { OAuthAppsBridge } from '../bridges/OAuthAppsBridge';

export class OAuthApps implements IOAuthApps {
    constructor(private readonly oauthAppsBridge: OAuthAppsBridge) {}

    public async createOAuthApp(OAuthApp: IOAuthApp, appId: string): Promise<string> {
        return this.oauthAppsBridge.doCreate(OAuthApp, appId);
    }

    public async getOAuthAppById(id: string, appId: string): Promise<IOAuthApp> {
        return this.oauthAppsBridge.doGetByid(id, appId);
    }

    public async getOAuthAppByName(name: string, appId: string): Promise<Array<IOAuthApp>> {
        return this.oauthAppsBridge.doGetByName(name, appId);
    }

    public async updateOAuthApp(OAuthApp: IOAuthApp, id: string, appId: string): Promise<void> {
        return this.oauthAppsBridge.doUpdate(OAuthApp, id, appId);
    }

    public async deleteOAuthApp(id: string, appId: string): Promise<void> {
        return this.oauthAppsBridge.doDelete(id, appId);
    }
}
