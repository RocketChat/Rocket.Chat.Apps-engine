import type { MessageBridge } from '../bridges/MessageBridge';
import type { IMessageRead } from '../../definition/accessors';
import type { IMessage, IMessageRaw } from '../../definition/messages';
import type { IRoom } from '../../definition/rooms';
import type { IUser } from '../../definition/users';
import type { GetMessagesOptions } from '../bridges/RoomBridge';

export class MessageRead implements IMessageRead {
    constructor(private messageBridge: MessageBridge, private appId: string) {}

    public getById(id: string): Promise<IMessage> {
        return this.messageBridge.doGetById(id, this.appId);
    }

    public async getSenderUser(messageId: string): Promise<IUser> {
        const msg = await this.messageBridge.doGetById(messageId, this.appId);

        if (!msg) {
            return undefined;
        }

        return msg.sender;
    }

    public async getRoom(messageId: string): Promise<IRoom> {
        const msg = await this.messageBridge.doGetById(messageId, this.appId);

        if (!msg) {
            return undefined;
        }

        return msg.room;
    }

    public async getUnreadByRoomAndUser(roomId: string, uid: string, options?: Partial<GetMessagesOptions>): Promise<IMessageRaw[]> {
        return this.messageBridge.doGetUnreadByRoomAndUser(roomId, uid, { limit: 100, ...options }, this.appId);
    }
}
