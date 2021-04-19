import { IUser } from '../users';
import { IConfigurationModify } from './IConfigurationModify';

export interface IAppInstallationContext {
    user: IUser;
    configurationModify: IConfigurationModify;
}
