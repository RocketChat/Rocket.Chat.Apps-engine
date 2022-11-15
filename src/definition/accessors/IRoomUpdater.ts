import { IRoom } from '../rooms';
import { IUser } from '../users';

export interface IRoomUpdater {
    muteUser(room: IRoom, executor: IUser, user: IUser): Promise<void>;

    unmuteUser(room: IRoom, executor: IUser, user: IUser): Promise<void>;

    hideRoom(room: IRoom, executor: IUser): Promise<void>;
}
