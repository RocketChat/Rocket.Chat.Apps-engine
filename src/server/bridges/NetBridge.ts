import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';
import { BaseBridge } from './BaseBridge';

export abstract class NetBridge extends BaseBridge {

    public doCreateConnection(options: object, appId: string): NodeJS.Socket {
      if (this.hasDefaultPermission(appId)) {
          return this.createConnection(options);
      }
    }

    protected abstract createConnection(options: object): NodeJS.Socket;

    private hasDefaultPermission(appId: string): boolean {
        if (AppPermissionManager.hasPermission(appId, AppPermissions.networking.default)) {
            return true;
        }

        AppPermissionManager.notifyAboutError(new PermissionDeniedError({
            appId,
            missingPermissions: [AppPermissions.networking.default],
        }));

        return false;
    }
}
