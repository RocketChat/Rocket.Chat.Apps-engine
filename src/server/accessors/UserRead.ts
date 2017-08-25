import { IUserRead } from 'temporary-rocketlets-ts-definition/accessors';
import { IUser } from 'temporary-rocketlets-ts-definition/users';
import { IUserBridge } from '../bridges/IUserBridge';

export class UserRead implements IUserRead {
    constructor(private userBridge: IUserBridge, private rocketletId: string) { }

    public getById(id: string): IUser {
        return this.userBridge.getById(id, this.rocketletId);
    }

    public getByUsername(username: string): IUser {
        return this.userBridge.getByUsername(username, this.rocketletId);
    }
}
