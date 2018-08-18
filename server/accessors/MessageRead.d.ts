import { IMessageBridge } from '../bridges/IMessageBridge';
import { IMessageRead } from '../../definition/accessors';
import { IMessage } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';
export declare class MessageRead implements IMessageRead {
    private messageBridge;
    private appId;
    constructor(messageBridge: IMessageBridge, appId: string);
    getById(id: string): Promise<IMessage>;
    getSenderUser(messageId: string): Promise<IUser>;
    getRoom(messageId: string): Promise<IRoom>;
}
