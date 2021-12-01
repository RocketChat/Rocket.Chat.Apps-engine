import { ILivechatUpdater, IMessageBuilder, IModifyUpdater, IRoomBuilder } from '../../definition/accessors';
import { IUserUpdater } from '../../definition/accessors/IUserUpdater';
import { RocketChatAssociationModel } from '../../definition/metadata';
import { RoomType } from '../../definition/rooms';
import { IUser } from '../../definition/users';
import { AppBridges } from '../bridges';
import { LivechatUpdater } from './LivechatUpdater';
import { MessageBuilder } from './MessageBuilder';
import { RoomBuilder } from './RoomBuilder';
import { UserUpdater } from './UserUpdater';

export class ModifyUpdater implements IModifyUpdater {
    private livechatUpdater: ILivechatUpdater;
    private userUpdater: IUserUpdater;

    constructor(private readonly bridges: AppBridges, private readonly appId: string) {
        this.livechatUpdater = new LivechatUpdater(this.bridges, this.appId);
        this.userUpdater = new UserUpdater(this.bridges, this.appId);
    }

    public getLivechatUpdater(): ILivechatUpdater {
        return this.livechatUpdater;
    }

    public getUserUpdater(): IUserUpdater {
        return this.userUpdater;
    }

    public async message(messageId: string, updater: IUser): Promise<IMessageBuilder> {
        const msg = await this.bridges.getMessageBridge().doGetById(messageId, this.appId);

        return new MessageBuilder(msg);
    }

    public async room(roomId: string, updater: IUser): Promise<IRoomBuilder> {
        const room = await this.bridges.getRoomBridge().doGetById(roomId, this.appId);

        return new RoomBuilder(room);
    }

    public finish(builder: IMessageBuilder | IRoomBuilder): Promise<void> {
        switch (builder.kind) {
            case RocketChatAssociationModel.MESSAGE:
                return this._finishMessage(builder);
            case RocketChatAssociationModel.ROOM:
                return this._finishRoom(builder);
            default:
                throw new Error('Invalid builder passed to the ModifyUpdater.finish function.');
        }
    }

    private _finishMessage(builder: IMessageBuilder): Promise<void> {
        const result = builder.getMessage();

        if (!result.id) {
            throw new Error('Invalid message, can\'t update a message without an id.');
        }

        if (!result.sender || !result.sender.id) {
            throw new Error('Invalid sender assigned to the message.');
        }

        return this.bridges.getMessageBridge().doUpdate(result, this.appId);
    }

    private _finishRoom(builder: IRoomBuilder): Promise<void> {
        const result = builder.getRoom();

        if (!result.id) {
            throw new Error('Invalid room, can not update a room without an id.');
        }

        if (!result.type) {
            throw new Error('Invalid type assigned to the room.');
        }

        if (result.type !== RoomType.LIVE_CHAT) {
            if (!result.creator || !result.creator.id) {
                throw new Error('Invalid creator assigned to the room.');
            }

            if (!result.slugifiedName || !result.slugifiedName.trim()) {
                throw new Error('Invalid slugifiedName assigned to the room.');
            }
        }

        if (!result.displayName || !result.displayName.trim()) {
            throw new Error('Invalid displayName assigned to the room.');
        }

        return this.bridges.getRoomBridge().doUpdate(result, builder.getMembersToBeAddedUsernames(), this.appId);
    }
}
