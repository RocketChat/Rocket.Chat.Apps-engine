import type { MessageBridge } from '../bridges/MessageBridge';
import type { IMessageRead } from '../../definition/accessors';
import type { IMessage, IMessageRaw } from '../../definition/messages';
import type { IRoom } from '../../definition/rooms';
import type { IUser } from '../../definition/users';
import { GetMessagesSortableFields, type GetMessagesOptions } from '../bridges/RoomBridge';

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
        if (typeof options.limit !== 'undefined' && (!Number.isFinite(options.limit) || options.limit > 100)) {
            throw new Error(`Invalid limit provided. Expected number <= 100, got ${options.limit}`);
        }

        if (typeof roomId !== 'string' || roomId.trim().length === 0) {
            throw new Error('Invalid roomId: must be a non-empty string');
        }

        if (options.sort) {
            this.validateSort(options.sort);
        }

        const completeOptions: GetMessagesOptions = {
            limit: options.limit ?? 100,
            sort: options.sort ?? { createdAt: 'asc' },
            skip: options.skip ?? 0,
        };

        return this.messageBridge.doGetUnreadByRoomAndUser(roomId, uid, completeOptions, this.appId);
    }

    private validateSort(sort: Record<string, unknown>) {
        Object.entries(sort).forEach(([key, value]) => {
            if (!GetMessagesSortableFields.includes(key as typeof GetMessagesSortableFields[number])) {
                throw new Error(`Invalid key "${key}" used in sort. Available keys for sorting are ${GetMessagesSortableFields.join(', ')}`);
            }

            if (value !== 'asc' && value !== 'desc') {
                throw new Error(`Invalid sort direction for field "${key}". Expected "asc" or "desc", got ${value}`);
            }
        });
    }
}
