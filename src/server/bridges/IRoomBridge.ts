import { IMessage } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';

export interface IRoomBridge {
    create(room: IRoom, members: Array<string>, appId: string): Promise<string>;
    getById(roomId: string, appId: string): Promise<IRoom>;
    getByName(roomName: string, appId: string): Promise<IRoom>;
    getCreatorById(roomId: string, appId: string): Promise<IUser>;
    getCreatorByName(roomName: string, appId: string): Promise<IUser>;
    getMessages(roomId: string, appId: string): Promise<AsyncIterableIterator<IMessage>>;
    getDirectByUsernames(username: Array<string>, appId: string): Promise<IRoom>;
    getMembers(roomId: string, appId: string): Promise<Array<IUser>>;
    update(room: IRoom, members: Array<string>, appId: string): Promise<void>;
    createDiscussion(room: IRoom, parentMessage: IMessage | undefined, reply: string | undefined, members: Array<string>, appId: string): Promise<string>;
}
