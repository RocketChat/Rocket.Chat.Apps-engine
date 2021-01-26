import { IUserRead } from '../../definition/accessors';
import { IUser } from '../../definition/users';
import { IUserBridge } from '../bridges/IUserBridge';

export class UserRead implements IUserRead {
    constructor(private userBridge: IUserBridge, private appId: string) { }

    public getById(id: string): Promise<IUser> {
        return this.userBridge.getById(id, this.appId);
    }

    public getByUsername(username: string): Promise<IUser> {
        return this.userBridge.getByUsername(username, this.appId);
    }

    public getAppUser(appId: string = this.appId): Promise<IUser | undefined> {
        return this.userBridge.getAppUser(appId);
    }
}
