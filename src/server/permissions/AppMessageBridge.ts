import { IMessage } from '../../definition/messages';
import { IPermission } from '../../definition/permission/IPermission';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';
import { ITypingDescriptor } from '../bridges/IMessageBridge';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions as Permissions } from './AppPermissions';

export const MessagePermissions: { [permission: string]: IPermission } = {
    // getById
    read: {
        name: 'message.read',
    },
    // create, update
    write: {
        name: 'message.write',
    },
    // notifyUser, notifyRoom, typing
    notification: {
        name: 'message.notification',
    },
};

export const AppMessageBridge = {
    getById(messageId: string, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, Permissions.message.read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [Permissions.message.read],
            });
        }
    },
    create(message: IMessage, appId: string): void {
        if (!AppPermissionManager.hasPermission(appId, Permissions.message.write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [Permissions.message.write],
            });
        }
        return;
    },
    update(message: IMessage, appId: string): void {
        return;
    },
    notifyUser(user: IUser, message: IMessage, appId: string): void {
        return;
    },
    notifyRoom(room: IRoom, message: IMessage, appId: string): void {
        return;
    },
    typing(options: ITypingDescriptor): void {
        return;
    },
};
