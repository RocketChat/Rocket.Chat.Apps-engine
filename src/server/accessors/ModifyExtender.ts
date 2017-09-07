import { IMessageExtender, IModifyExtender, IRoomExtender } from 'temporary-rocketlets-ts-definition/accessors';
import { RocketChatAssociationModel } from 'temporary-rocketlets-ts-definition/metadata';
import { IUser } from 'temporary-rocketlets-ts-definition/users';

import { RocketletBridges } from '../bridges/RocketletBridges';
import { MessageExtender } from './MessageExtender';
import { RoomExtender } from './RoomExtender';

export class ModifyExtender implements IModifyExtender {
    constructor(private readonly bridges: RocketletBridges, private readonly rocketletId: string) { }

    public extendMessage(messageId: string, updater: IUser): IMessageExtender {
        const msg = this.bridges.getMessageBridge().getById(messageId, this.rocketletId);
        msg.editor = updater;
        msg.editedAt = new Date();

        return new MessageExtender(msg);
    }

    public extendRoom(roomId: string, updater: IUser): IRoomExtender {
        const room = this.bridges.getRoomBridge().getById(roomId, this.rocketletId);
        room.updatedAt = new Date();

        return new RoomExtender(room);
    }

    public finish(extender: IMessageExtender | IRoomExtender): void {
        switch (extender.kind) {
            case RocketChatAssociationModel.MESSAGE:
                return this.bridges.getMessageBridge().update(extender.getMessage(), this.rocketletId);
            case RocketChatAssociationModel.ROOM:
                return this.bridges.getRoomBridge().update(extender.getRoom(), this.rocketletId);
            default:
                throw new Error('Invalid builder passed to the ModifyExtender.finish function.');
        }
    }
}
