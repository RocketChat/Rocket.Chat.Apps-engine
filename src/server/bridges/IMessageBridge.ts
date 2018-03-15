import { IMessage } from '@rocket.chat/apps-ts-definition/messages';
import { IRoom } from '@rocket.chat/apps-ts-definition/rooms';
import { IUser } from '@rocket.chat/apps-ts-definition/users/IUser';

export interface IMessageBridge {
    create(message: IMessage, appId: string): string;
    getById(messageId: string, appId: string): IMessage;
    update(message: IMessage, appId: string): void;
    notifyUser(user: IUser, message: IMessage, appId: string): void;
    notifyRoom(room: IRoom, message: IMessage, appId: string): void;
}
