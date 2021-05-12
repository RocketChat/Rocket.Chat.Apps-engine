import { IMessage } from '../../../src/definition/messages';
import { IRoom } from '../../../src/definition/rooms';
import { IUser } from '../../../src/definition/users';
import { MessageBridge } from '../../../src/server/bridges';
import { ITypingDescriptor } from '../../../src/server/bridges/MessageBridge';

export class TestsMessageBridge {
    public doCreate(message: IMessage, appId: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public doGetById(messageId: string, appId: string): Promise<IMessage> {
        throw new Error('Method not implemented.');
    }

    public doUpdate(message: IMessage, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public doNotifyUser(user: IUser, message: IMessage, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public doNotifyRoom(room: IRoom, message: IMessage, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public doTyping(options: ITypingDescriptor): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
