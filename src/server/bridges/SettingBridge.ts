import { ISetting } from '../../definition/settings';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';
import { BaseBridge } from './BaseBridge';

export abstract class SettingBridge extends BaseBridge {
   public async doGetAll(appId: string): Promise<Array<ISetting>> {
       if (this.checkReadPermission(appId)) {
           return this.getAll(appId);
       }
    }

   public async doGetOneById(id: string, appId: string): Promise<ISetting> {
       if (this.checkReadPermission(appId)) {
           return this.getOneById(id, appId);
       }
    }

   public async doHideGroup(name: string, appId: string): Promise<void> {
       if (this.checkWritePermission(appId)) {
           return this.hideGroup(name, appId);
       }
    }

   public async doHideSetting(id: string, appId: string): Promise<void> {
       if (this.checkWritePermission(appId)) {
           return this.hideSetting(id, appId);
       }
    }

   public async doIsReadableById(id: string, appId: string): Promise<boolean> {
       if (this.checkReadPermission(appId)) {
           return this.isReadableById(id, appId);
       }
    }

   public async doUpdateOne(setting: ISetting, appId: string): Promise<void> {
       if (this.checkWritePermission(appId)) {
           return this.updateOne(setting, appId);
       }
    }

   protected abstract getAll(appId: string): Promise<Array<ISetting>>;
   protected abstract getOneById(id: string, appId: string): Promise<ISetting>;
   protected abstract hideGroup(name: string, appId: string): Promise<void>;
   protected abstract hideSetting(id: string, appId: string): Promise<void>;
   protected abstract isReadableById(id: string, appId: string): Promise<boolean>;
   protected abstract updateOne(setting: ISetting, appId: string): Promise<void>;

    private checkWritePermission(appId: string): boolean {
        if (AppPermissionManager.hasPermission(appId, AppPermissions.setting.write)) {
            return true;
        }

        AppPermissionManager.notifyAboutError(new PermissionDeniedError({
            appId,
            missingPermissions: [AppPermissions.setting.write],
        }));

        return false;
    }

    private checkReadPermission(appId: string): boolean {
        if (AppPermissionManager.hasPermission(appId, AppPermissions.setting.read)) {
            return true;
        }

        AppPermissionManager.notifyAboutError(new PermissionDeniedError({
            appId,
            missingPermissions: [AppPermissions.setting.read],
        }));

        return false;
    }
}
