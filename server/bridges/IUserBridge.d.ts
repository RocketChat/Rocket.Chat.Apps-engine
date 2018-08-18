import { IUser } from '../../definition/users';
export interface IUserBridge {
    getById(id: string, appId: string): Promise<IUser>;
    getByUsername(username: string, appId: string): Promise<IUser>;
}
