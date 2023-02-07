import type { IUser } from '../users';

export interface IModifyDeleter {
    deleteRoom(roomId: string): Promise<void>;

    deleteBotUsers(appId: Exclude<IUser['appId'], undefined>): Promise<boolean>;
}
