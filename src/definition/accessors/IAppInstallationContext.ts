import { IUser } from '../users';
import { IModify } from './IModify';

export interface IAppInstallationContext {
    user: IUser;
    modify: IModify;
}
