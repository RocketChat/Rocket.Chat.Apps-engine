import type { IUser, UserType } from '../users';

export interface IModifyDeleter {
    deleteRoom(roomId: string): Promise<void>;

    deleteBotUser(appId: Exclude<IUser['appId'], undefined>, type: UserType.APP | UserType.BOT): Promise<boolean>;
}
