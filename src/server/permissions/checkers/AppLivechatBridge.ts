import { ILivechatMessage, ILivechatRoom, ILivechatTransferData, IVisitor } from '../../../definition/livechat';
import { IUser } from '../../../definition/users';
import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppLivechatBridge = {
    isOnline(departmentId?: string, appId?: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-status'].read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-status'].read],
            });
        }
    },
    isOnlineAsync(departmentId?: string, appId?: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-status'].read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-status'].read],
            });
        }
    },
    updateMessage(message: ILivechatMessage, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-message'].write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-message'].write],
            });
        }
    },
    createMessage(message: ILivechatMessage, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-message'].write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-message'].write],
            });
        }
    },
    createVisitor(visitor: IVisitor, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-visitor'].write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-visitor'].write],
            });
        }
    },
    findVisitors(query: object, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-visitor'].read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-visitor'].read],
            });
        }
    },
    findVisitorById(id: string, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-visitor'].read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-visitor'].read],
            });
        }
    },
    findVisitorByEmail(email: string, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-visitor'].read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-visitor'].read],
            });
        }
    },
    findVisitorByToken(token: string, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-visitor'].read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-visitor'].read],
            });
        }
    },
    findVisitorByPhoneNumber(phoneNumber: string, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-visitor'].read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-visitor'].read],
            });
        }
    },
    transferVisitor(visitor: IVisitor, transferData: ILivechatTransferData, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-visitor'].write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-visitor'].write],
            });
        }
    },
    createRoom(visitor: IVisitor, agent: IUser, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-room'].write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-room'].write],
            });
        }
    },
    closeRoom(room: ILivechatRoom, comment: string, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-room'].write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-room'].write],
            });
        }
    },
    findRooms(visitor: IVisitor, departmentId: string | null, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-room'].read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-room'].read],
            });
        }
    },
    findDepartmentByIdOrName(value: string, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-department'].read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-department'].read],
            });
        }
    },
    setCustomFields(data: { token: IVisitor['token']; key: string; value: string; overwrite: boolean }, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-custom-fields'].write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-custom-fields'].write],
            });
        }
    },
};
