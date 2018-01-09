import { IRoom } from '@rocket.chat/apps-ts-definition/rooms';

export interface IRoomBridge {
    create(room: IRoom, appId: string): string;
    getById(roomId: string, appId: string): IRoom;
    getByName(roomName: string, appId: string): IRoom;
    update(room: IRoom, appId: string): void;
}
