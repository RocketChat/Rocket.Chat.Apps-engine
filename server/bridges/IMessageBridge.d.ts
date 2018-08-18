import { IMessage } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users/IUser';
export interface IMessageBridge {
    create(message: IMessage, appId: string): Promise<string>;
    getById(messageId: string, appId: string): Promise<IMessage>;
    update(message: IMessage, appId: string): Promise<void>;
    notifyUser(user: IUser, message: IMessage, appId: string): Promise<void>;
    notifyRoom(room: IRoom, message: IMessage, appId: string): Promise<void>;
}
