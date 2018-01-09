import { IMessageBuilder, IModifyCreator, IRoomBuilder } from '@rocket.chat/apps-ts-definition/accessors';
import { IMessage } from '@rocket.chat/apps-ts-definition/messages';
import { RocketChatAssociationModel } from '@rocket.chat/apps-ts-definition/metadata';
import { IRoom } from '@rocket.chat/apps-ts-definition/rooms';

import { AppBridges } from '../bridges';
import { MessageBuilder } from './MessageBuilder';
import { RoomBuilder } from './RoomBuilder';

export class ModifyCreator implements IModifyCreator {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) { }

    public startMessage(data?: IMessage): IMessageBuilder {
        if (data) {
            delete data.id;
        }

        return new MessageBuilder(data);
    }

    public startRoom(data?: IRoom): IRoomBuilder {
        if (data) {
            delete data.id;
        }

        return new RoomBuilder(data);
    }

    public finish(builder: IMessageBuilder | IRoomBuilder): string {
        switch (builder.kind) {
            case RocketChatAssociationModel.MESSAGE:
                return this._finishMessage(builder);
            case RocketChatAssociationModel.ROOM:
                return this._finishRoom(builder);
            default:
                throw new Error('Invalid builder passed to the ModifyCreator.finish function.');
        }
    }

    private _finishMessage(builder: IMessageBuilder): string {
        const result = builder.getMessage();
        delete result.id;

        if (!result.room || !result.room.id) {
            throw new Error('Invalid room assigned to the message.');
        }

        if (!result.sender || !result.sender.id) {
            throw new Error('Invalid sender assigned to the message.');
        }

        return this.bridges.getMessageBridge().create(result, this.appId);
    }

    private _finishRoom(builder: IRoomBuilder): string {
        const result = builder.getRoom();
        delete result.id;

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

        return this.bridges.getRoomBridge().create(result, this.appId);
    }
}
