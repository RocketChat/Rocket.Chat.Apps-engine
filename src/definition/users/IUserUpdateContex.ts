import { IUser } from './IUser';

export interface IUserUpdateContext {
    user: IUser;
    performedBy?: IUser;
    previousData?: IUser;
}
