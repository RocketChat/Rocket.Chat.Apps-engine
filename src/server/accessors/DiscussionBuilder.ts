import { IDiscussionBuilder } from '../../definition/accessors';
import { RocketChatAssociationModel } from '../../definition/metadata';
import { RoomType } from '../../definition/rooms';
import { IRoom } from '../../definition/rooms/IRoom';
import { RoomBuilder } from './RoomBuilder';

export class DiscussionBuilder extends RoomBuilder implements IDiscussionBuilder {
    public kind: RocketChatAssociationModel.DISCUSSION;

    constructor(data?: IRoom) {
        super(data);
        this.kind = RocketChatAssociationModel.DISCUSSION;
        this.room.type = RoomType.PRIVATE_GROUP;
    }

    public setParentRoom(parentRoom: IRoom): IDiscussionBuilder {
        this.room.parentRoom = parentRoom;
        return this;
    }

    public getParentRoom(): IRoom {
        return this.room.parentRoom;
    }
}
