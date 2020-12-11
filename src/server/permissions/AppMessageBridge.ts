import { IMessage } from '../../definition/messages';
import { IPermission } from '../../definition/permission/IPermission';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';
import { ITypingDescriptor } from '../bridges/IMessageBridge';

export const MessagePermissions: { [permission: string]: IPermission } = {
    // getById
    'message.read': {
        name: 'message.read',
    },
    // create, update
    'message.write': {
        name: 'message.write',
    },
    // notifyUser, notifyRoom, typing
    'message.notification': {
        name: 'message.notification',
    },
};

export const AppMessageBridge = {
    getById(messageId: string, appId: string): void {
        return;
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
