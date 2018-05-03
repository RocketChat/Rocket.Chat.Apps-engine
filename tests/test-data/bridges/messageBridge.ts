import { IMessage } from '@rocket.chat/apps-ts-definition/messages';
import { IRoom } from '@rocket.chat/apps-ts-definition/rooms';
import { IUser } from '@rocket.chat/apps-ts-definition/users';

import { IMessageBridge } from '../../../src/server/bridges';

export class TestsMessageBridge implements IMessageBridge {
    public create(message: IMessage, appId: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public getById(messageId: string, appId: string): Promise<IMessage> {
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
}
