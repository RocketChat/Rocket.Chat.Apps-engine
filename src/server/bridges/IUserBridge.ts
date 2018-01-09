import { IUser } from '@rocket.chat/apps-ts-definition/users';

export interface IUserBridge {
    getById(id: string, appId: string): IUser;

    getByUsername(username: string, appId: string): IUser;
}
