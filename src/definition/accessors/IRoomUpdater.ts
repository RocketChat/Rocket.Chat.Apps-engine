import { IRoom } from '../rooms';
import { IUser } from '../users';

export interface IRoomUpdater {
    muteUser(room: IRoom, executorId: IUser, user: IUser): Promise<void>;

    unmuteUser(room: IRoom, executorId: IUser, user: IUser): Promise<void>;
}
