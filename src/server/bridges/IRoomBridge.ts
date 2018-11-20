import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';

export interface IRoomBridge {
    create(room: IRoom, members: Array<string>, appId: string): Promise<string>;
    getById(roomId: string, appId: string): Promise<IRoom>;
    getByName(roomName: string, appId: string): Promise<IRoom>;
    getCreatorById(roomId: string, appId: string): Promise<IUser>;
    getCreatorByName(roomName: string, appId: string): Promise<IUser>;
    getDirectByUsernames(username: Array<string>, appId: string): Promise<IRoom>;
    update(room: IRoom, members: Array<string>, appId: string): Promise<void>;
}
