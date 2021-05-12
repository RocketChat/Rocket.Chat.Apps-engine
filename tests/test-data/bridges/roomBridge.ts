import { IMessage } from '../../../src/definition/messages';
import { IRoom } from '../../../src/definition/rooms';
import { IUser } from '../../../src/definition/users';
import { RoomBridge } from '../../../src/server/bridges';

export class TestsRoomBridge {
    public doCreate(room: IRoom, members: Array<string>, appId: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public doGetById(roomId: string, appId: string): Promise<IRoom> {
        throw new Error('Method not implemented.');
    }

    public doGetCreatorById(roomId: string, appId: string): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    public doGetByName(roomName: string, appId: string): Promise<IRoom> {
        throw new Error('Method not implemented.');
    }

    public doGetCreatorByName(roomName: string, appId: string): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    public doGetDirectByUsernames(username: Array<string>, appId: string): Promise<IRoom> {
        throw new Error('Method not implemented');
    }

    public doGetMembers(roomName: string, appId: string): Promise<Array<IUser>> {
        throw new Error('Method not implemented.');
    }

    public doUpdate(room: IRoom, members: Array<string>, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public doCreateDiscussion(room: IRoom, parentMessage: IMessage, reply: string, members: Array<string>, appId: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public doDelete(roomId: string, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
