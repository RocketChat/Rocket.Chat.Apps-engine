import { ITypingOptions } from '../../definition/accessors/INotifier';
import { IMessage } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users/IUser';

export interface ITypingDescriptor extends ITypingOptions {
    isTyping: boolean;
}

export interface IMessageBridge {
    create(message: IMessage, appId: string): Promise<string>;
    getById(messageId: string, appId: string): Promise<IMessage>;
    update(message: IMessage, appId: string): Promise<void>;
    notifyUser(user: IUser, message: IMessage, appId: string): Promise<void>;
    notifyRoom(room: IRoom, message: IMessage, appId: string): Promise<void>;
    typing(options: ITypingDescriptor): Promise<void>;
}
