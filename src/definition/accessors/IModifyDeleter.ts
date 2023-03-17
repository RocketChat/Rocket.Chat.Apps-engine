import { UserType } from './../users/UserType';
import type { IUser } from '../users';

export interface IModifyDeleter {
    deleteRoom(roomId: string): Promise<void>;

    deleteUsers(appId: Exclude<IUser['appId'], undefined>, userType: UserType.APP | UserType.BOT): Promise<boolean>;
}
