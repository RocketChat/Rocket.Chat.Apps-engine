import {
    IDepartment,
    ILivechatMessage,
    ILivechatRoom,
    ILivechatTransferData,
    IVisitor,
} from '../../definition/livechat';
import { IUser } from '../../definition/users';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';

import { BaseBridge } from './BaseBridge';

export abstract class LivechatBridge extends BaseBridge {
   public doIsOnline(departmentId?: string, appId?: string): boolean {
       if (this.checkReadPermission(appId, 'status')) {
           return this.isOnline(departmentId, appId);
       }
    }

   public async doIsOnlineAsync(departmentId?: string, appId?: string): Promise<boolean> {
       if (this.checkReadPermission(appId, 'status')) {
           return this.isOnlineAsync(departmentId, appId);
       }
    }

   public async doCreateMessage(message: ILivechatMessage, appId: string): Promise<string> {
       if (this.checkWritePermission(appId, 'message')) {
           return this.createMessage(message, appId);
       }
    }

   public async doGetMessageById(messageId: string, appId: string): Promise<ILivechatMessage> {
       if (this.checkReadPermission(appId, 'message')) {
           return this.getMessageById(messageId, appId);
       }
    }

   public async doUpdateMessage(message: ILivechatMessage, appId: string): Promise<void> {
       if (this.checkWritePermission(appId, 'message')) {
           return this.updateMessage(message, appId);
       }
    }

   public async doCreateVisitor(visitor: IVisitor, appId: string): Promise<string> {
       if (this.checkWritePermission(appId, 'visitor')) {
           return this.createVisitor(visitor, appId);
       }
    }

   public async doFindVisitors(query: object, appId: string): Promise<Array<IVisitor>> {
       if (this.checkReadPermission(appId, 'visitor')) {
           return this.findVisitors(query, appId);
       }
    }

   public async doFindVisitorById(id: string, appId: string): Promise<IVisitor | undefined> {
       if (this.checkReadPermission(appId, 'visitor')) {
           return this.findVisitorById(id, appId);
       }
    }

   public async doFindVisitorByEmail(email: string, appId: string): Promise<IVisitor | undefined> {
       if (this.checkReadPermission(appId, 'visitor')) {
           return this.findVisitorByEmail(email, appId);
       }
    }

   public async doFindVisitorByToken(token: string, appId: string): Promise<IVisitor | undefined> {
       if (this.checkReadPermission(appId, 'visitor')) {
           return this.findVisitorByToken(token, appId);
       }
    }

   public async doFindVisitorByPhoneNumber(phoneNumber: string, appId: string): Promise<IVisitor | undefined> {
       if (this.checkReadPermission(appId, 'visitor')) {
           return this.findVisitorByPhoneNumber(phoneNumber, appId);
       }
    }

   public async doTransferVisitor(visitor: IVisitor, transferData: ILivechatTransferData, appId: string): Promise<boolean> {
       if (this.checkWritePermission(appId, 'visitor')) {
           return this.transferVisitor(visitor, transferData, appId);
       }
    }

   public async doCreateRoom(visitor: IVisitor, agent: IUser, appId: string): Promise<ILivechatRoom> {
       if (this.checkWritePermission(appId, 'room')) {
           return this.createRoom(visitor, agent, appId);
       }
    }

   public async doCloseRoom(room: ILivechatRoom, comment: string, appId: string): Promise<boolean> {
       if (this.checkWritePermission(appId, 'room')) {
           return this.closeRoom(room, comment, appId);
       }
    }

   public async doFindRooms(visitor: IVisitor, departmentId: string | null, appId: string): Promise<Array<ILivechatRoom>> {
       if (this.checkReadPermission(appId, 'room')) {
           return this.findRooms(visitor, departmentId, appId);
       }
    }

   public async doFindDepartmentByIdOrName(value: string, appId: string): Promise<IDepartment | undefined> {
       if (this.checkReadPermission(appId, 'department')) {
           return this.findDepartmentByIdOrName(value, appId);
       }
    }

    public async doSetCustomFields(data: { token: IVisitor['token']; key: string; value: string; overwrite: boolean }, appId: string): Promise<number> {
        if (this.checkWritePermission(appId, 'custom-fields')) {
            return this.setCustomFields(data, appId);
        }
    }

    /**
     * @deprecated please use the `isOnlineAsync` method instead.
     * In the next major, this method will be `async`
     */
    protected abstract isOnline(departmentId?: string, appId?: string): boolean;
    protected abstract isOnlineAsync(departmentId?: string, appId?: string): Promise<boolean>;
    protected abstract createMessage(message: ILivechatMessage, appId: string): Promise<string>;
    protected abstract getMessageById(messageId: string, appId: string): Promise<ILivechatMessage>;
    protected abstract updateMessage(message: ILivechatMessage, appId: string): Promise<void>;
    protected abstract createVisitor(visitor: IVisitor, appId: string): Promise<string>;
    /**
     * @deprecated This method does not adhere to the conversion practices applied
     * elsewhere in the Apps-Engine and will be removed in the next major version.
     * Prefer other methods that fetch visitors.
     */
    protected abstract findVisitors(query: object, appId: string): Promise<Array<IVisitor>>;
    protected abstract findVisitorById(id: string, appId: string): Promise<IVisitor | undefined>;
    protected abstract findVisitorByEmail(email: string, appId: string): Promise<IVisitor | undefined>;
    protected abstract findVisitorByToken(token: string, appId: string): Promise<IVisitor | undefined>;
    protected abstract findVisitorByPhoneNumber(phoneNumber: string, appId: string): Promise<IVisitor | undefined>;
    protected abstract transferVisitor(visitor: IVisitor, transferData: ILivechatTransferData, appId: string): Promise<boolean>;
    protected abstract createRoom(visitor: IVisitor, agent: IUser, appId: string): Promise<ILivechatRoom>;
    protected abstract closeRoom(room: ILivechatRoom, comment: string, appId: string): Promise<boolean>;
    protected abstract findRooms(visitor: IVisitor, departmentId: string | null, appId: string): Promise<Array<ILivechatRoom>>;
    protected abstract findDepartmentByIdOrName(value: string, appId: string): Promise<IDepartment | undefined>;

    protected abstract setCustomFields(data: { token: IVisitor['token']; key: string; value: string; overwrite: boolean }, appId: string): Promise<number>;

    private checkReadPermission(appId: string, feature: string): boolean {
        if (!AppPermissionManager.hasPermission(appId, (AppPermissions as any)[`livechat-${ feature }`].read)) {
            return true;
        }

        AppPermissionManager.notifyAboutError(new PermissionDeniedError({
            appId,
            missingPermissions: [(AppPermissions as any)[`livechat-${ feature }`].read],
        }));

        return false;
    }

    private checkWritePermission(appId: string, feature: string): boolean {
        if (!AppPermissionManager.hasPermission(appId, (AppPermissions as any)[`livechat-${ feature }`].write)) {
            return true;
        }

        AppPermissionManager.notifyAboutError(new PermissionDeniedError({
            appId,
            missingPermissions: [(AppPermissions as any)[`livechat-${ feature }`].write],
        }));

        return false;
    }
}
