import { IRoomRead } from '../../definition/accessors';
import { IMessage } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';
import { IRoomBridge } from '../bridges';
export declare class RoomRead implements IRoomRead {
    private roomBridge;
    private appId;
    constructor(roomBridge: IRoomBridge, appId: string);
    getById(id: string): Promise<IRoom>;
    getCreatorUserById(id: string): Promise<IUser>;
    getByName(name: string): Promise<IRoom>;
    getCreatorUserByName(name: string): Promise<IUser>;
    getMessages(roomId: string): Promise<IterableIterator<IMessage>>;
    getMembers(roomId: string): Promise<IterableIterator<IUser>>;
}
