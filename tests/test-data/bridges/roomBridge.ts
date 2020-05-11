import { IMessage } from '../../../src/definition/messages';
import { IRoom } from '../../../src/definition/rooms';
import { IUser } from '../../../src/definition/users';
import { IRoomBridge } from '../../../src/server/bridges';

export class TestsRoomBridge implements IRoomBridge {
    public create(room: IRoom, members: Array<string>, appId: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public getById(roomId: string, appId: string): Promise<IRoom> {
        throw new Error('Method not implemented.');
    }

    public getCreatorById(roomId: string, appId: string): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    public getByName(roomName: string, appId: string): Promise<IRoom> {
        throw new Error('Method not implemented.');
    }

    public getCreatorByName(roomName: string, appId: string): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    public getMessages(roomId: string): Promise<AsyncIterableIterator<IMessage>> {
        throw new Error('Method not implemented.');
    }

    public getDirectByUsernames(username: Array<string>, appId: string): Promise<IRoom> {
        throw new Error('Method not implemented');
    }

    public getMembers(roomName: string, appId: string): Promise<Array<IUser>> {
        throw new Error('Method not implemented.');
    }

    public update(room: IRoom, members: Array<string>, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public createDiscussion(room: IRoom, parentMessage: IMessage, reply: string, members: Array<string>, appId: string): Promise<string> {
        throw new Error('Method not implemented.');
    }
}
