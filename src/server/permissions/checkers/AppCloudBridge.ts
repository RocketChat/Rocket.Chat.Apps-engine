import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppCloudBridge = {
    getWorkspaceAccessToken(scope: string, appId: string): void {
        const grantedPermission = AppPermissionManager.hasPermission(appId, AppPermissions.cloud['workspace-token']);

        if (!grantedPermission || grantedPermission.scopes?.includes(scope) === false) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.cloud['workspace-token']],
                reason: `Missing scope "${scope}" in permission`,
            });
        }
    },
};
