import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppApi } from '../../managers/AppApi';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppApisBridge = {
    hasGeneralPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.apis.general)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.apis.general],
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
