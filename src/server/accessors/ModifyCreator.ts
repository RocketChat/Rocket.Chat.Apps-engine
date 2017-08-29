import { IMessageBuilder, IModifyCreator, IRoomBuilder } from 'temporary-rocketlets-ts-definition/accessors';
import { IMessage } from 'temporary-rocketlets-ts-definition/messages';
import { RocketChatAssociationModel } from 'temporary-rocketlets-ts-definition/metadata';
import { IRoom } from 'temporary-rocketlets-ts-definition/rooms';

import { RocketletBridges } from '../bridges';
import { MessageBuilder } from './MessageBuilder';
import { RoomBuilder } from './RoomBuilder';

export class ModifyCreator implements IModifyCreator {
    constructor(private readonly bridges: RocketletBridges, private readonly rocketletId: string) { }

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

        return this.bridges.getMessageBridge().create(result, this.rocketletId);
    }

    private _finishRoom(builder: IRoomBuilder): string {
        const result = builder.getRoom();
        delete result.id;

        if (!result.creator || !result.creator.id) {
            throw new Error('Invalid creator assigned to the room.');
        }

        if (!result.name || !result.name.trim()) {
            throw new Error('Invalid name assigned to the room.');
        }

        if (!result.type) {
            throw new Error('Invalid type assigned to the room.');
        }

        return this.bridges.getRoomBridge().create(result, this.rocketletId);
    }
}
