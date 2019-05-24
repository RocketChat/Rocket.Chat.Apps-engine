import { ILivechatMessageBuilder, IMessageBuilder, IModifyCreator, IRoomBuilder } from '../../definition/accessors';
import { IMessage } from '../../definition/messages';
import { RocketChatAssociationModel } from '../../definition/metadata';
import { IRoom, RoomType } from '../../definition/rooms';

import { ILivechatCreator } from '../../definition/accessors/IModify';
import { ILivechatMessage } from '../../definition/livechat/ILivechatMessage';
import { AppBridges } from '../bridges';
import { LivechatCreator } from './LivechatCreator';
import { LivechatMessageBuilder } from './LivechatMessageBuilder';
import { MessageBuilder } from './MessageBuilder';
import { RoomBuilder } from './RoomBuilder';

export class ModifyCreator implements IModifyCreator {
    private livechatCreator: LivechatCreator;

    constructor(private readonly bridges: AppBridges, private readonly appId: string) {
        this.livechatCreator = new LivechatCreator(bridges, appId);
    }

    public getLivechatCreator(): ILivechatCreator {
        return this.livechatCreator;
    }

    public startMessage(data?: IMessage): IMessageBuilder {
        if (data) {
            delete data.id;
        }

        return new MessageBuilder(data);
    }

    public startLivechatMessage(data?: ILivechatMessage): ILivechatMessageBuilder {
        if (data) {
            delete data.id;
        }

        return new LivechatMessageBuilder(data);
    }

    public startRoom(data?: IRoom): IRoomBuilder {
        if (data) {
            delete data.id;
        }

        return new RoomBuilder(data);
    }

    public finish(builder: IMessageBuilder | ILivechatMessageBuilder | IRoomBuilder): Promise<string> {
        switch (builder.kind) {
            case RocketChatAssociationModel.MESSAGE:
                return this._finishMessage(builder);
            case RocketChatAssociationModel.LIVECHAT_MESSAGE:
                return this._finishLivechatMessage(builder);
            case RocketChatAssociationModel.ROOM:
                return this._finishRoom(builder);
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

    private _finishLivechatMessage(builder: ILivechatMessageBuilder): Promise<string> {
        if (builder.getSender() && !builder.getVisitor()) {
            return this._finishMessage(builder.getMessageBuilder());
        }

        const result = builder.getMessage();
        delete result.id;

        if (!result.token && (!result.visitor || !result.visitor.token)) {
            throw new Error('Invalid visitor sending the message');
        }

        result.token = result.visitor ? result.visitor.token : result.token;

        return this.bridges.getLivechatBridge().createMessage(result, this.appId);
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
}
