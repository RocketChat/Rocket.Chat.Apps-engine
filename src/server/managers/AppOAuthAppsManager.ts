import { IOAuthApp, IOAuthAppParams } from '../../definition/accessors/IOAuthApps';
import { AppManager } from '../AppManager';
import { OAuthAppsBridge } from '../bridges/OAuthAppsBridge';

export class AppOAuthAppsManager {
    private readonly bridge: OAuthAppsBridge;
    constructor(private readonly manager: AppManager) {
        this.bridge = this.manager.getBridges().getOAuthAppsBridge();
    }

    public create(OAuthApp: IOAuthAppParams, appId: string): Promise<string> {
        return this.bridge.doCreate(OAuthApp, appId);
    }
    public getById(id: string, appId: string): Promise<IOAuthApp> {
        return this.bridge.doGetByid(id, appId);
    }
    public update(OAuthApp: IOAuthAppParams, id: string, appId: string): Promise<void> {
        return this.bridge.doUpdate(OAuthApp, id, appId);
    }
    public delete(id: string, appId: string): Promise<void> {
        return this.bridge.doDelete(id, appId);
    }
    public removeAllOAuthApps(appId: string): Promise<void> {
        return this.bridge.doPurge(appId);
    }

}
