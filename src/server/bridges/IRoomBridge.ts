import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';

export interface IRoomBridge {
    create(room: IRoom, members: Array<string>, appId: string): Promise<string>;
    getById(roomId: string, appId: string): Promise<IRoom>;
    getByName(roomName: string, appId: string): Promise<IRoom>;
    getCreatorById(roomId: string, appId: string): Promise<IUser>;
    getCreatorByName(roomName: string, appId: string): Promise<IUser>;
    getMembers(roomId: string, appId: string): Promise<IterableIterator<IUser>>;
    update(room: IRoom, members: Array<string>, appId: string): Promise<void>;
}
