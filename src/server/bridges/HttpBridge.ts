import { IHttpRequest, IHttpResponse, RequestMethod } from '../../definition/accessors';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';
import { BaseBridge } from './BaseBridge';

export interface IHttpBridgeRequestInfo {
    appId: string;
    method: RequestMethod;
    url: string;
    request: IHttpRequest;
}

export abstract class HttpBridge extends BaseBridge {
    public async doCall(info: IHttpBridgeRequestInfo): Promise<IHttpResponse> {
        if (this.checkDefaultPermission(info.appId)) {
            return this.call(info);
        }
    }

    protected abstract call(info: IHttpBridgeRequestInfo): Promise<IHttpResponse>;

    private checkDefaultPermission(appId: string): boolean {
        if (AppPermissionManager.hasPermission(appId, AppPermissions.networking.default)) {
            return true;
        }

        AppPermissionManager.notifyAboutError(new PermissionDeniedError({
            appId,
            missingPermissions: [AppPermissions.networking.default],
        }));

        return false;
    }
}
