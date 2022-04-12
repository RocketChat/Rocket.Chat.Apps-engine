import { IUser } from './IUser';

export interface IUserContext {
    user: IUser;
    performedBy?: IUser;
}
