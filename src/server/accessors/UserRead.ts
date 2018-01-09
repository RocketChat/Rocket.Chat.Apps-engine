import { IUserRead } from '@rocket.chat/apps-ts-definition/accessors';
import { IUser } from '@rocket.chat/apps-ts-definition/users';
import { IUserBridge } from '../bridges/IUserBridge';

export class UserRead implements IUserRead {
    constructor(private userBridge: IUserBridge, private appId: string) { }

    public getById(id: string): IUser {
        return this.userBridge.getById(id, this.appId);
    }

    public getByUsername(username: string): IUser {
        return this.userBridge.getByUsername(username, this.appId);
    }
}
