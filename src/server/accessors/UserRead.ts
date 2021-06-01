import { IUserRead } from '../../definition/accessors';
import { IUser } from '../../definition/users';
import { UserBridge } from '../bridges/UserBridge';

export class UserRead implements IUserRead {
    constructor(private userBridge: UserBridge, private appId: string) { }

    public getById(id: string): Promise<IUser> {
        return this.userBridge.doGetById(id, this.appId);
    }

    public getByUsername(username: string): Promise<IUser> {
        return this.userBridge.doGetByUsername(username, this.appId);
    }

    public getAppUser(appId: string = this.appId): Promise<IUser | undefined> {
        return this.userBridge.doGetAppUser(appId);
    }
}
