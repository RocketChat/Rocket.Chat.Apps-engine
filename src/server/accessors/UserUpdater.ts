import { IUserUpdater } from '../../definition/accessors/IUserUpdater';
import { IUser } from '../../definition/users/IUser';
import { AppBridges } from '../bridges';

export class UserUpdater implements IUserUpdater {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) { }

    public async updateStatusText(user: IUser, statusText: IUser['statusText']) {
        return this.bridges.getUserBridge().update(user, { statusText }, this.appId);
    }

    public async updateBio(user: IUser, bio: IUser['bio']) {
        return this.bridges.getUserBridge().update(user, { bio }, this.appId);
    }

    public async updateCustomFields(user: IUser, customFields: IUser['customFields']) {
        return this.bridges.getUserBridge().update(user, { customFields }, this.appId);
    }
}
