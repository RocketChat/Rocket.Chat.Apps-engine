import { ILivechatMessage, ILivechatRoom, ILivechatTransferData, IVisitor } from '../../../definition/livechat';
import { IUser } from '../../../definition/users';
import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppLivechatBridge = {
    hasReadPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.livechat.read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.livechat.read],
            });
        }
    },
    hasWritePermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.livechat.write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.livechat.write],
            });
        }
    },
    updateMessage(message: ILivechatMessage, appId: string): void {
        return this.hasWritePermission(appId);
    },
    createVisitor(visitor: IVisitor, appId: string): void {
        return this.hasWritePermission(appId);
    },
    findVisitors(query: object, appId: string): void {
        return this.hasReadPermission(appId);
    },
    findVisitorById(id: string, appId: string): void {
        return this.hasReadPermission(appId);
    },
    findVisitorByEmail(email: string, appId: string): void {
        return this.hasReadPermission(appId);
    },
    findVisitorByToken(token: string, appId: string): void {
        return this.hasReadPermission(appId);
    },
    findVisitorByPhoneNumber(phoneNumber: string, appdId: string): void {
        return this.hasReadPermission(appdId);
    },
    transferVisitor(visitor: IVisitor, transferData: ILivechatTransferData, appId: string): void {
        return this.hasWritePermission(appId);
    },
    createRoom(visitor: IVisitor, agent: IUser, appId: string): void {
        return this.hasWritePermission(appId);
    },
    closeRoom(room: ILivechatRoom, comment: string, appId: string): void {
        return this.hasWritePermission(appId);
    },
    findRooms(visitor: IVisitor, departmentId: string | null, appId: string): void {
        return this.hasReadPermission(appId);
    },
    findDepartmentByIdOrName(value: string, appdId: string): void {
        return this.hasReadPermission(appdId);
    },
    setCustomFields(data: { token: IVisitor['token']; key: string; value: string; overwrite: boolean }, appId: string): void {
        return this.hasWritePermission(appId);
    },
};
