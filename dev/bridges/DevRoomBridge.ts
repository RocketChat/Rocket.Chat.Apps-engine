import { IRoom } from '@rocket.chat/apps-ts-definition/rooms';

import { IRoomBridge } from '../../src/server/bridges';

export class DevRoomBridge implements IRoomBridge {
    public create(room: IRoom, appId: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public getById(roomId: string, appId: string): Promise<IRoom> {
        throw new Error('Method not implemented.');
    }

    public getByName(roomName: string, appId: string): Promise<IRoom> {
        throw new Error('Method not implemented.');
    }

    public update(room: IRoom, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
