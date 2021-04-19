import { IUser, IUserCreationOptions } from '../../definition/users';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';
import { BaseBridge } from './BaseBridge';

export abstract class UserBridge extends BaseBridge {
    public async doGetById(id: string, appId: string): Promise<IUser> {
        if (this.checkReadPermission(appId)) {
            return this.getById(id, appId);
        }
    }

    public async doGetByUsername(username: string, appId: string): Promise<IUser> {
        if (this.checkReadPermission(appId)) {
            return this.getByUsername(username, appId);
        }
    }

    public async doGetAppUser(appId?: string): Promise<IUser | undefined> {
        if (this.checkReadPermission(appId)) {
            return this.getAppUser();
        }
    }

    public async doGetActiveUserCount(appId?: string): Promise<number> {
        if (this.checkReadPermission(appId)) {
            return this.getActiveUserCount();
        }
    }

    public async doCreate(data: Partial<IUser>, appId: string, options?: IUserCreationOptions): Promise<string> {
        if (this.checkWritePermission(appId)) {
            return this.create(data, appId, options || {});
        }
    }

    public async doRemove(user: IUser, appId: string): Promise<boolean> {
        if (this.checkWritePermission(appId)) {
            return this.remove(user, appId);
        }
    }

    public async doUpdate(user: IUser, updates: Partial<IUser>, appId: string): Promise<boolean> {
        if (this.checkWritePermission(appId)) {
            return this.update(user, updates, appId);
        }
    }

    protected abstract getById(id: string, appId: string): Promise<IUser>;
    protected abstract getByUsername(username: string, appId: string): Promise<IUser>;
    protected abstract getAppUser(appId?: string): Promise<IUser | undefined>;
    protected abstract getActiveUserCount(): Promise<number>;
    /**
     * Creates a user.
     * @param data the essential data for creating a user
     * @param appId the id of the app calling this
     * @param options options for passing extra data
     */
    protected abstract create(data: Partial<IUser>, appId: string, options?: IUserCreationOptions): Promise<string>;
    /**
     * Remove a user.
     *
     * @param user the user object to be removed
     * @param appId the id of the app executing the call
     */
    protected abstract remove(user: IUser, appId: string): Promise<boolean>;
    /**
     * Updates a user.
     *
     * Note: the actual methods used by apps to update
     * user properties are much more granular, but at a
     * bridge level we can adopt a more practical approach
     * since it is only accessible internally by the framework
     *
     * @param user the user to be updated
     * @param updates a map of properties to be updated
     * @param appId the id of the app executing the call
     */
    protected abstract update(user: IUser, updates: Partial<IUser>, appId: string): Promise<boolean>;

    private checkReadPermission(appId: string): boolean {
        if (AppPermissionManager.hasPermission(appId, AppPermissions.user.read)) {
            return true;
        }

        AppPermissionManager.notifyAboutError(new PermissionDeniedError({
            appId,
            missingPermissions: [AppPermissions.user.read],
        }));

        return false;
    }

    private checkWritePermission(appId: string): boolean {
        if (AppPermissionManager.hasPermission(appId, AppPermissions.user.write)) {
            return true;
        }

        AppPermissionManager.notifyAboutError(new PermissionDeniedError({
            appId,
            missingPermissions: [AppPermissions.user.write],
        }));

        return false;
    }
}
