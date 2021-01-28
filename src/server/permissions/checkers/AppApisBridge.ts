import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppApi } from '../../managers/AppApi';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppApisBridge = {
    hasGeneralPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.apis.default)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.apis.default],
            });
        }
    },
    registerApi(api: AppApi, appId: string): void {
        return this.hasGeneralPermission(appId);
    },
    unregisterApis(appId: string): void {
        return this.hasGeneralPermission(appId);
    },
};
