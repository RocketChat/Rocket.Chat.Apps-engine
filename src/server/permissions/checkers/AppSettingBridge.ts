import { ISetting } from '../../../definition/settings';
import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppSettingBridge = {
    hasReadPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.setting.read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.setting.read],
            });
        }
    },
    hasWritePermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.setting.write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.message.write],
            });
        }
    },
    getAll(appId: string): void {
        return this.hasReadPermission(appId);
    },
    getOneById(id: string, appId: string): void {
        return this.hasReadPermission(appId);
    },
    hideGroup(name: string, appId: string): void {
        return this.hasWritePermission(appId);
    },
    hideSetting(id: string, appId: string): void {
        return this.hasWritePermission(appId);
    },
    isReadableById(id: string, appId: string): void {
        return this.hasReadPermission(appId);
    },
    updateOne(setting: ISetting, appId: string): void {
        return this.hasWritePermission(appId);
    },
};
