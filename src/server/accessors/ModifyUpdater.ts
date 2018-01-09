import { IMessageBuilder, IModifyUpdater, IRoomBuilder } from '@rocket.chat/apps-ts-definition/accessors';
import { RocketChatAssociationModel } from '@rocket.chat/apps-ts-definition/metadata';
import { IUser } from '@rocket.chat/apps-ts-definition/users';

import { AppBridges } from '../bridges';
import { MessageBuilder } from './MessageBuilder';
import { RoomBuilder } from './RoomBuilder';

export class ModifyUpdater implements IModifyUpdater {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) { }

    public message(messageId: string, updater: IUser): IMessageBuilder {
        const msg = this.bridges.getMessageBridge().getById(messageId, this.appId);

        return new MessageBuilder(msg);
    }

    public room(roomId: string, updater: IUser): IRoomBuilder {
        const room = this.bridges.getRoomBridge().getById(roomId, this.appId);

        return new RoomBuilder(room);
    }

    public finish(builder: IMessageBuilder | IRoomBuilder): void {
        switch (builder.kind) {
            case RocketChatAssociationModel.MESSAGE:
                return this._finishMessage(builder);
            case RocketChatAssociationModel.ROOM:
                return this._finishRoom(builder);
            default:
                throw new Error('Invalid builder passed to the ModifyUpdater.finish function.');
        }
    }

    private _finishMessage(builder: IMessageBuilder): void {
        const result = builder.getMessage();

        if (!result.room || !result.room.id) {
            throw new Error('Invalid room assigned to the message.');
        }

        if (!result.sender || !result.sender.id) {
            throw new Error('Invalid sender assigned to the message.');
        }

        return this.bridges.getMessageBridge().update(result, this.appId);
    }

    private _finishRoom(builder: IRoomBuilder): void {
        const result = builder.getRoom();

        if (!result.creator || !result.creator.id) {
            throw new Error('Invalid creator assigned to the room.');
        }

        if (!result.slugifiedName || !result.slugifiedName.trim()) {
            throw new Error('Invalid slugifiedName assigned to the room.');
        }

        if (!result.displayName || !result.displayName.trim()) {
            throw new Error('Invalid displayName assigned to the room.');
        }

        if (!result.type) {
            throw new Error('Invalid type assigned to the room.');
        }

        return this.bridges.getRoomBridge().update(result, this.appId);
    }
}
