import { IRoom } from 'temporary-rocketlets-ts-definition/rooms';

export interface IRoomBridge {
    create(room: IRoom, rocketletId: string): string;
    getById(id: string, rocketletId: string): IRoom;
}
