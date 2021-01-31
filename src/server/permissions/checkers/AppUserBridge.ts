import { IUser, IUserCreationOptions } from '../../../definition/users';
import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppUserBridge = {
    hasReadPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.user.read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.user.read],
            });
        }
    },
    hasWritePermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.user.write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.user.write],
            });
        }
    },
    getById(id: string, appId: string): void {
        return this.hasReadPermission(appId);
    },
    getByUsername(username: string, appId: string): void {
        return this.hasReadPermission(appId);
    },
    getAppUser(appId: string): void {
        return this.hasReadPermission(appId);
    },
    /**
     * @private internal bridge method, pass it.
     */
    getActiveUserCount(): void {
        return;
    },
    create(data: Partial<IUser>, appId: string, options?: IUserCreationOptions) {
        return this.hasWritePermission(appId);
    },
    remove(user: IUser, appId: string): void {
        return this.hasWritePermission(appId);
    },
    update(user: IUser, updates: Partial<IUser>, appId: string): void {
        return this.hasWritePermission(appId);
    },
};
