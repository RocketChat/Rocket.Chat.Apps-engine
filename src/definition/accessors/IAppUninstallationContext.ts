import { IUser } from '../users';
import { IModify } from './IModify';

export interface IAppUninstallationContext {
    user: IUser;
    modify: IModify;
}
