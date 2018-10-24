import { IRoom } from '../../../src/definition/rooms';
import { IUser } from '../../../src/definition/users';

import { IRoomBridge } from '../../../src/server/bridges';

export class TestsRoomBridge implements IRoomBridge {
    public create(room: IRoom, appId: string): Promise<string> {
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

    public update(room: IRoom, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
