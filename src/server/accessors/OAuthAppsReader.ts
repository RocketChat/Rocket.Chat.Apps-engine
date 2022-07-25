import { IOAuthApp } from '../../definition/accessors/IOAuthAppsModify';
import { IOAuthAppsReader } from '../../definition/accessors/IOAuthAppsReader';
import { OAuthAppsBridge } from '../bridges/OAuthAppsBridge';

export class OAuthAppsReader implements IOAuthAppsReader {
    constructor(
        private readonly oauthAppsBridge: OAuthAppsBridge,
        private readonly appId: string,
    ) {}

    public async getOAuthAppById(id: string): Promise<IOAuthApp> {
        return this.oauthAppsBridge.doGetByid(id, this.appId);
    }

    public async getOAuthAppByName(name: string): Promise<Array<IOAuthApp>> {
        return this.oauthAppsBridge.doGetByName(name, this.appId);
    }
}
