import { IRoom } from '../rooms';

export interface IRoomUpdater {
    archiveRoom(room: IRoom): Promise<boolean>;
    unarchiveRoom(room: IRoom): Promise<boolean>;
}
