import { ISetting } from '../../../definition/settings';
import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppDetailChangesBridge = {
    onAppSettingsChange(appId: string, setting: ISetting): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['app-details'].settings)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['app-details'].settings],
            });
        }
    },
};
