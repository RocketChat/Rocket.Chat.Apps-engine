import { ILivechatMessage, ILivechatRoom, ILivechatTransferData, IVisitor } from '../../../definition/livechat';
import { IUser } from '../../../definition/users';
import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppLivechatBridge = {
    updateMessage(message: ILivechatMessage, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-message'].write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-message'].write],
            });
        }

        return this.hasWritePermission(appId);
    },
    createVisitor(visitor: IVisitor, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-visitor'].write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-visitor'].write],
            });
        }

        return this.hasWritePermission(appId);
    },
    findVisitors(query: object, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-visitor'].read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-visitor'].read],
            });
        }

        return this.hasReadPermission(appId);
    },
    findVisitorById(id: string, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-visitor'].read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-visitor'].read],
            });
        }

        return this.hasReadPermission(appId);
    },
    findVisitorByEmail(email: string, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-visitor'].read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-visitor'].read],
            });
        }

        return this.hasReadPermission(appId);
    },
    findVisitorByToken(token: string, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-visitor'].read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-visitor'].read],
            });
        }

        return this.hasReadPermission(appId);
    },
    findVisitorByPhoneNumber(phoneNumber: string, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-visitor'].read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-visitor'].read],
            });
        }

        return this.hasReadPermission(appId);
    },
    transferVisitor(visitor: IVisitor, transferData: ILivechatTransferData, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-visitor'].write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-visitor'].write],
            });
        }

        return this.hasWritePermission(appId);
    },
    createRoom(visitor: IVisitor, agent: IUser, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-room'].write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-room'].write],
            });
        }

        return this.hasWritePermission(appId);
    },
    closeRoom(room: ILivechatRoom, comment: string, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-room'].write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-room'].write],
            });
        }

        return this.hasWritePermission(appId);
    },
    findRooms(visitor: IVisitor, departmentId: string | null, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-room'].read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-room'].read],
            });
        }

        return this.hasReadPermission(appId);
    },
    findDepartmentByIdOrName(value: string, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-department'].read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-department'].read],
            });
        }

        return this.hasReadPermission(appId);
    },
    setCustomFields(data: { token: IVisitor['token']; key: string; value: string; overwrite: boolean }, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions['livechat-custom-fields'].write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions['livechat-custom-fields'].write],
            });
        }

        return this.hasWritePermission(appId);
    },
};
