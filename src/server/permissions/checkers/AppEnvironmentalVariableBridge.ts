import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppEnvironmentalVariableBridge = {
    hasReadPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.env.read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.env.read],
            });
        }
    },
    getValueByName(envVarName: string, appId: string): void {
        return;
    },
    isReadable(envVarName: string, appId: string): void {
        return;
    },
    isSet(envVarName: string, appId: string): void {
        return;
    },
};
