import { IHttpBridgeRequestInfo } from '../../bridges';
import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppHttpBridge = {
    call(info: IHttpBridgeRequestInfo): void {
        if (!AppPermissionManager.hasPermission(info.appId, AppPermissions.http.general)) {
            throw new PermissionDeniedError({
                appId: info.appId,
                missingPermissions: [AppPermissions.http.general],
            });
        }
    },
};
