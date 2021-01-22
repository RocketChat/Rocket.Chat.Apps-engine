import { IMessage } from '../../../definition/messages';
import { IRoom } from '../../../definition/rooms';
import { IUser } from '../../../definition/users';
import { ITypingDescriptor } from '../../bridges/IMessageBridge';
import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppMessageBridge = {
    hasReadPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.message.read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.message.read],
            });
        }
    },
    hasWritePermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.message.write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.message.write],
            });
        }
    },
    hasNotificationPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.message.notification)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.message.notification],
            });
        }
    },
    getById(messageId: string, appId: string): void {
        return this.hasReadPermission(appId);
    },
    create(message: IMessage, appId: string): void {
        return this.hasWritePermission(appId);
    },
    update(message: IMessage, appId: string): void {
        return this.hasWritePermission(appId);
    },
    notifyUser(user: IUser, message: IMessage, appId: string): void {
        return this.hasNotificationPermission(appId);
    },
    notifyRoom(room: IRoom, message: IMessage, appId: string): void {
        return this.hasNotificationPermission(appId);
    },
    typing(options: ITypingDescriptor, appId: string): void {
        return this.hasNotificationPermission(appId);
    },
};
