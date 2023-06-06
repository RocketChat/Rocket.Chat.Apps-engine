import { IMessage } from '../messages';
import type { IUser, UserType } from '../users';

export interface IModifyDeleter {
    deleteRoom(roomId: string): Promise<void>;

    deleteUsers(appId: Exclude<IUser['appId'], undefined>, userType: UserType.APP | UserType.BOT): Promise<boolean>;

    deleteMessage(message: IMessage, user: IUser): Promise<void>;
}
