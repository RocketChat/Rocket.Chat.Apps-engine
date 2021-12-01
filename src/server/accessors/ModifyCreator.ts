import {
    IDiscussionBuilder,
    ILivechatCreator,
    ILivechatMessageBuilder,
    IMessageBuilder,
    IModifyCreator,
    IRoomBuilder,
    IUploadCreator,
} from '../../definition/accessors';
import { ILivechatMessage } from '../../definition/livechat/ILivechatMessage';
import { IMessage } from '../../definition/messages';
import { RocketChatAssociationModel } from '../../definition/metadata';
import { IRoom, RoomType } from '../../definition/rooms';
import { BlockBuilder } from '../../definition/uikit';
import { AppBridges } from '../bridges';
import { DiscussionBuilder } from './DiscussionBuilder';
import { LivechatCreator } from './LivechatCreator';
import { LivechatMessageBuilder } from './LivechatMessageBuilder';
import { MessageBuilder } from './MessageBuilder';
import { RoomBuilder } from './RoomBuilder';
import { UploadCreator } from './UploadCreator';

export class ModifyCreator implements IModifyCreator {
    private livechatCreator: LivechatCreator;
    private uploadCreator: UploadCreator;

    constructor(private readonly bridges: AppBridges, private readonly appId: string) {
        this.livechatCreator = new LivechatCreator(bridges, appId);
        this.uploadCreator = new UploadCreator(bridges, appId);
    }

    public getLivechatCreator(): ILivechatCreator {
        return this.livechatCreator;
    }

    public getUploadCreator(): IUploadCreator {
        return this.uploadCreator;
    }

    public getBlockBuilder(): BlockBuilder {
        return new BlockBuilder(this.appId);
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

    public startDiscussion(data?: Partial<IRoom>): IDiscussionBuilder {
        if (data) {
            delete data.id;
        }

        return new DiscussionBuilder(data);
    }

    public finish(builder: IMessageBuilder | ILivechatMessageBuilder | IRoomBuilder | IDiscussionBuilder): Promise<string> {
        switch (builder.kind) {
            case RocketChatAssociationModel.MESSAGE:
                return this._finishMessage(builder);
            case RocketChatAssociationModel.LIVECHAT_MESSAGE:
                return this._finishLivechatMessage(builder);
            case RocketChatAssociationModel.ROOM:
                return this._finishRoom(builder);
            case RocketChatAssociationModel.DISCUSSION:
                return this._finishDiscussion(builder as IDiscussionBuilder);
            default:
                throw new Error('Invalid builder passed to the ModifyCreator.finish function.');
        }
    }

    private async _finishMessage(builder: IMessageBuilder): Promise<string> {
        const result = builder.getMessage();
        delete result.id;

        if (!result.sender || !result.sender.id) {
            const appUser = await this.bridges.getUserBridge().doGetAppUser(this.appId);

            if (!appUser) {
                throw new Error('Invalid sender assigned to the message.');
            }

            result.sender = appUser;
        }

        return this.bridges.getMessageBridge().doCreate(result, this.appId);
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

        return this.bridges.getLivechatBridge().doCreateMessage(result, this.appId);
    }

    private _finishRoom(builder: IRoomBuilder): Promise<string> {
        const result = builder.getRoom();
        delete result.id;

        if (!result.type) {
            throw new Error('Invalid type assigned to the room.');
        }

        if (result.type !== RoomType.LIVE_CHAT) {
            if (!result.creator || !result.creator.id) {
                throw new Error('Invalid creator assigned to the room.');
            }
        }

        if (result.type !== RoomType.DIRECT_MESSAGE) {
            if (result.type !== RoomType.LIVE_CHAT) {
                if (!result.slugifiedName || !result.slugifiedName.trim()) {
                    throw new Error('Invalid slugifiedName assigned to the room.');
                }
            }

            if (!result.displayName || !result.displayName.trim()) {
                throw new Error('Invalid displayName assigned to the room.');
            }
        }

        return this.bridges.getRoomBridge().doCreate(result, builder.getMembersToBeAddedUsernames(), this.appId);
    }

    private _finishDiscussion(builder: IDiscussionBuilder): Promise<string> {
        const room = builder.getRoom();
        delete room.id;

        if (!room.creator || !room.creator.id) {
            throw new Error('Invalid creator assigned to the discussion.');
        }

        if (!room.slugifiedName || !room.slugifiedName.trim()) {
            throw new Error('Invalid slugifiedName assigned to the discussion.');
        }

        if (!room.displayName || !room.displayName.trim()) {
            throw new Error('Invalid displayName assigned to the discussion.');
        }

        if (!room.parentRoom || !room.parentRoom.id) {
            throw new Error('Invalid parentRoom assigned to the discussion.');
        }

        return this.bridges.getRoomBridge().doCreateDiscussion(
            room,
            builder.getParentMessage(),
            builder.getReply(),
            builder.getMembersToBeAddedUsernames(),
            this.appId,
        );
    }
}
