import { IMessageBridge } from '../bridges/IMessageBridge';

import { IMessageRead } from 'temporary-rocketlets-ts-definition/accessors';
import { IMessage } from 'temporary-rocketlets-ts-definition/messages';
import { IRoom } from 'temporary-rocketlets-ts-definition/rooms';
import { IUser } from 'temporary-rocketlets-ts-definition/users';

export class MessageRead implements IMessageRead {
    constructor(private messageBridge: IMessageBridge, private rocketletId: string) { }

    public getById(id: string): IMessage {
        return this.messageBridge.getById(id, this.rocketletId);
    }

    public getSenderUser(messageId: string): IUser {
        const msg = this.messageBridge.getById(messageId, this.rocketletId);

        if (!msg) {
            return undefined;
        }

        return msg.sender;
    }

    public getRoom(messageId: string): IRoom {
        const msg = this.messageBridge.getById(messageId, this.rocketletId);

        if (!msg) {
            return undefined;
        }

        return msg.room;
    }
}
