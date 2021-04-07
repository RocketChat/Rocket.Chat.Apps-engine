import { IPermission } from '../../definition/permissions/IPermission';
import { getPermissionsByAppId } from '../AppManager';

export class AppPermissionManager {
    /**
     * It returns the declaration of the permission if the app declared, or it returns `undefined`.
     */
    public static hasPermission<P extends IPermission>(appId: string, permission: P): P | undefined {
        const grantedPermission = getPermissionsByAppId(appId).find(({ name }) => name === permission.name) as unknown;

        if (!grantedPermission) {
            return undefined;
        }

        return grantedPermission as P;
    }
}
