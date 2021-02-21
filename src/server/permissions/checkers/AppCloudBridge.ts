import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppCloudBridge = {
    getWorkspaceToken(scope: string, appId: string): void {
        const grantedPermission = AppPermissionManager.hasPermission(appId, AppPermissions.cloud['workspace-token']);
        const isMissingScope = grantedPermission.scopes?.includes(scope) === false;

        if (scope.startsWith('workspace')) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.cloud['workspace-token']],
                message: `Forbidden scope "${scope}" requested`,
            });
        }

        if (!grantedPermission || isMissingScope) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.cloud['workspace-token']],
                ...isMissingScope && { reason: `Missing scope "${scope}" in permission` },
            });
        }
    },
};
