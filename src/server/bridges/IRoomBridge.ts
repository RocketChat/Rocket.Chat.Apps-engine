import { IRoom } from 'temporary-rocketlets-ts-definition/rooms';

export interface IRoomBridge {
    create(room: IRoom, rocketletId: string): string;
    getById(roomId: string, rocketletId: string): IRoom;
    getByName(roomName: string, rocketletId: string): IRoom;
}
