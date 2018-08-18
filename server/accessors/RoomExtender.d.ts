import { IRoomExtender } from '../../definition/accessors';
import { RocketChatAssociationModel } from '../../definition/metadata';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';
export declare class RoomExtender implements IRoomExtender {
    private room;
    kind: RocketChatAssociationModel.ROOM;
    constructor(room: IRoom);
    addCustomField(key: string, value: any): IRoomExtender;
    addMember(user: IUser): IRoomExtender;
    getRoom(): IRoom;
}
