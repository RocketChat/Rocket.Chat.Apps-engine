import { IUser, IUserCreator } from '../../definition/users';

export interface IUserBridge {
    getById(id: string, appId: string): Promise<IUser>;

    getByUsername(username: string, appId: string): Promise<IUser>;

    create(user: IUserCreator, appId: string): Promise<string>;

    getActiveUserCount(): Promise<number>;
}
