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

    public getAppUser(): Promise<IUser | undefined> {
        return this.userBridge.doGetAppUser(this.appId);
    }

    public getUserUnreadMessageCount(uid: string): Promise<number> {
        return this.userBridge.doGetUserUnreadMessageCount(uid, this.appId);
    }
}
