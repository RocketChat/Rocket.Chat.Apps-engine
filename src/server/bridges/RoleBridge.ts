import { IRole } from '../../definition/roles';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';
import { BaseBridge } from './BaseBridge';

export abstract class RoleBridge extends BaseBridge {
    public async doGetOneByIdOrName(idOrName: IRole['_id'] | IRole['name'], appId: string): Promise<IRole | null> {
        if (this.hasReadPermission(appId)) {
            return this.getOneByIdOrName(idOrName, appId);
        }
    }

    public abstract getOneByIdOrName(idOrName: IRole['_id'] | IRole['name'], appId: string): Promise<IRole | null>;

    private hasReadPermission(appId: string): boolean {
        if (AppPermissionManager.hasPermission(appId, AppPermissions.role.read)) {
            return true;
        }

        AppPermissionManager.notifyAboutError(
            new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.role.read],
            }),
        );

        return false;
    }
}
