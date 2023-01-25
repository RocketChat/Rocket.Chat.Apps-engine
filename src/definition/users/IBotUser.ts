import { UserType } from './UserType';
import { IUser } from './IUser';

export interface IBotUser extends Omit<IUser, 'emails' | 'utcOffset'> {
    type: UserType.BOT;
}
