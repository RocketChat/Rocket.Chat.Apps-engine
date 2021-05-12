import { IMessage } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';

export interface IRoomBridge {
    doCreate(room: IRoom, members: Array<string>, appId: string): Promise<string>;
    doGetById(roomId: string, appId: string): Promise<IRoom>;
    doGetByName(roomName: string, appId: string): Promise<IRoom>;
    doGetCreatorById(roomId: string, appId: string): Promise<IUser | undefined>;
    doGetCreatorByName(roomName: string, appId: string): Promise<IUser | undefined>;
    doGetDirectByUsernames(username: Array<string>, appId: string): Promise<IRoom | undefined>;
    doGetMembers(roomId: string, appId: string): Promise<Array<IUser>>;
    doUpdate(room: IRoom, members: Array<string>, appId: string): Promise<void>;
    doCreateDiscussion(room: IRoom, parentMessage: IMessage | undefined, reply: string | undefined, members: Array<string>, appId: string): Promise<string>;
    delete(roomId: string, appId: string): Promise<void>;
}
