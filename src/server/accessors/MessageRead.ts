import { IMessageBridge } from '../bridges/IMessageBridge';

import { IMessageRead } from '@rocket.chat/apps-ts-definition/accessors';
import { IMessage } from '@rocket.chat/apps-ts-definition/messages';
import { IRoom } from '@rocket.chat/apps-ts-definition/rooms';
import { IUser } from '@rocket.chat/apps-ts-definition/users';

export class MessageRead implements IMessageRead {
    constructor(private messageBridge: IMessageBridge, private appId: string) { }

    public getById(id: string): IMessage {
        return this.messageBridge.getById(id, this.appId);
    }

    public getSenderUser(messageId: string): IUser {
        const msg = this.messageBridge.getById(messageId, this.appId);

        if (!msg) {
            return undefined;
        }

        return msg.sender;
    }

    public getRoom(messageId: string): IRoom {
        const msg = this.messageBridge.getById(messageId, this.appId);

        if (!msg) {
            return undefined;
        }

        return msg.room;
    }
}
