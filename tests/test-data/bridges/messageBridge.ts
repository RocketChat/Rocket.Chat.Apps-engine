import type { IMessage } from '../../../src/definition/messages';
import type { IRoom } from '../../../src/definition/rooms';
import type { IUser } from '../../../src/definition/users';
import { MessageBridge } from '../../../src/server/bridges';
import type { ITypingDescriptor } from '../../../src/server/bridges/MessageBridge';

export class TestsMessageBridge extends MessageBridge {
    public create(message: IMessage, appId: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public getById(messageId: string, appId: string): Promise<IMessage> {
        throw new Error('Method not implemented.');
    }

    public getUnreadByRoomAndUser(
        roomId: string,
        uid: string,
        options: { limit: number; skip?: number; sort?: Record<string, 1 | -1> },
        appId: string,
    ): Promise<IMessage[]> {
        throw new Error('Method not implemented.');
    }

    public update(message: IMessage, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public notifyUser(user: IUser, message: IMessage, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public notifyRoom(room: IRoom, message: IMessage, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public delete(message: IMessage, user: IUser, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public typing(options: ITypingDescriptor): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
