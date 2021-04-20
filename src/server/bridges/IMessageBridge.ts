import { ITypingOptions } from '../../definition/accessors/INotifier';
import { IMessage } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users/IUser';

export interface ITypingDescriptor extends ITypingOptions {
    isTyping: boolean;
}

export interface IMessageBridge {
    doCreate(message: IMessage, appId: string): Promise<string>;
    doGetById(messageId: string, appId: string): Promise<IMessage>;
    doUpdate(message: IMessage, appId: string): Promise<void>;
    doNotifyUser(user: IUser, message: IMessage, appId: string): Promise<void>;
    doNotifyRoom(room: IRoom, message: IMessage, appId: string): Promise<void>;
    doTyping(options: ITypingDescriptor, appId: string): Promise<void>;
}
