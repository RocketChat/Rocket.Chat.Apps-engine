import { IUser } from 'temporary-rocketlets-ts-definition/users';

export interface IUserBridge {
    getById(id: string, rocketletId: string): IUser;

    getByUsername(username: string, rocketletId: string): IUser;
}
