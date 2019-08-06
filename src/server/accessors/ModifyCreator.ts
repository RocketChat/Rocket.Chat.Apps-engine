import { IMessageBuilder, IModifyCreator, IRoomBuilder } from '../../definition/accessors';
import { IMessage } from '../../definition/messages';
import { RocketChatAssociationModel } from '../../definition/metadata';
import { IRoom, RoomType } from '../../definition/rooms';

import { IUserBuilder } from '../../definition/accessors/IModify';
import { IUserGenerate } from '../../definition/users';
import { AppBridges } from '../bridges';
import { MessageBuilder } from './MessageBuilder';
import { RoomBuilder } from './RoomBuilder';
import { UserBuilder } from './UserBuilder';

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

    public startUser(data?: IUserGenerate): IUserBuilder {
        if (data) {
            delete data.id;
        }

        return new UserBuilder(data);
    }

    public finish(builder: IMessageBuilder | IRoomBuilder | IUserBuilder): Promise<string> {
        switch (builder.kind) {
            case RocketChatAssociationModel.MESSAGE:
                return this._finishMessage(builder);
            case RocketChatAssociationModel.ROOM:
                return this._finishRoom(builder);
            case RocketChatAssociationModel.USER:
                return this._finishUser(builder);
            default:
                throw new Error('Invalid builder passed to the ModifyCreator.finish function.');
        }
    }

    private _finishMessage(builder: IMessageBuilder): Promise<string> {
        const result = builder.getMessage();
        delete result.id;

        if (!result.sender || !result.sender.id) {
            throw new Error('Invalid sender assigned to the message.');
        }

        return this.bridges.getMessageBridge().create(result, this.appId);
    }

    private _finishRoom(builder: IRoomBuilder): Promise<string> {
        const result = builder.getRoom();
        delete result.id;

        if (!result.creator || !result.creator.id) {
            throw new Error('Invalid creator assigned to the room.');
        }

        if (!result.type) {
            throw new Error('Invalid type assigned to the room.');
        }

        if (result.type !== RoomType.DIRECT_MESSAGE) {
            if (!result.slugifiedName || !result.slugifiedName.trim()) {
                throw new Error('Invalid slugifiedName assigned to the room.');
            }

            if (!result.displayName || !result.displayName.trim()) {
                throw new Error('Invalid displayName assigned to the room.');
            }
        }

        return this.bridges.getRoomBridge().create(result, builder.getMembersToBeAddedUsernames(), this.appId);
    }

    private _finishUser(builder: IUserBuilder): Promise<string> {
        const result = builder.getUser();
        delete result.id;
        return this.bridges.getUserBridge().create(result, this.appId);
    }
}
