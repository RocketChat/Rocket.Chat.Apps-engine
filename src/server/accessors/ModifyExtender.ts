import { IMessageExtender, IModifyExtender, IRoomExtender } from '@rocket.chat/apps-ts-definition/accessors';
import { RocketChatAssociationModel } from '@rocket.chat/apps-ts-definition/metadata';
import { IUser } from '@rocket.chat/apps-ts-definition/users';

import { AppBridges } from '../bridges/AppBridges';
import { MessageExtender } from './MessageExtender';
import { RoomExtender } from './RoomExtender';

export class ModifyExtender implements IModifyExtender {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) { }

    public extendMessage(messageId: string, updater: IUser): IMessageExtender {
        const msg = this.bridges.getMessageBridge().getById(messageId, this.appId);
        msg.editor = updater;
        msg.editedAt = new Date();

        return new MessageExtender(msg);
    }

    public extendRoom(roomId: string, updater: IUser): IRoomExtender {
        const room = this.bridges.getRoomBridge().getById(roomId, this.appId);
        room.updatedAt = new Date();

        return new RoomExtender(room);
    }

    public finish(extender: IMessageExtender | IRoomExtender): void {
        switch (extender.kind) {
            case RocketChatAssociationModel.MESSAGE:
                return this.bridges.getMessageBridge().update(extender.getMessage(), this.appId);
            case RocketChatAssociationModel.ROOM:
                return this.bridges.getRoomBridge().update(extender.getRoom(), this.appId);
            default:
                throw new Error('Invalid builder passed to the ModifyExtender.finish function.');
        }
    }
}
