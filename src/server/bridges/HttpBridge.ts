import { IHttpResponse } from '../../definition/accessors';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';
import { BaseBridge } from './BaseBridge';
import { IHttpBridgeRequestInfo } from './IHttpBridge';

export abstract class HttpBridge extends BaseBridge {
    public async doCall(info: IHttpBridgeRequestInfo): Promise<IHttpResponse> {
        this.checkDefaultPermission(info.appId);

        return this.call(info);
    }

    protected abstract call(info: IHttpBridgeRequestInfo): Promise<IHttpResponse>;

    private checkDefaultPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.networking.default)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.networking.default],
            });
        }
    }
}
