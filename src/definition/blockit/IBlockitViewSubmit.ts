import { IUser } from '../users';

export interface IBlockitViewSubmit {
    appId: string;
    actionId: string;
    state: object;
    user: IUser;
    triggerId?: string;
}
