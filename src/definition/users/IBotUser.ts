import { IUser } from './IUser';
import { UserType } from './UserType';

export interface IBotUser extends Omit<IUser, 'emails'> {
    type: UserType.BOT;
}
