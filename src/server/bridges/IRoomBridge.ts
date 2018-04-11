import { IRoom } from '@rocket.chat/apps-ts-definition/rooms';

export interface IRoomBridge {
    create(room: IRoom, appId: string): Promise<string>;
    getById(roomId: string, appId: string): Promise<IRoom>;
    getByName(roomName: string, appId: string): Promise<IRoom>;
    update(room: IRoom, appId: string): Promise<void>;
}
