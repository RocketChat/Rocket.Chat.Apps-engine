import { IMessage } from '../../definition/messages';
import { AppPermission } from '../../definition/permission/AppPermission';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';
import { ITypingDescriptor } from '../bridges/IMessageBridge';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';

export const AppMessageBridge = {
    getById(messageId: string, appId: string): void {
        throw new PermissionDeniedError(appId, [
            AppPermission.MessageRead,
            AppPermission.MessageWrite,
        ]);
    },
    create(message: IMessage, appId: string): void {
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
