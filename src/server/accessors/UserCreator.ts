import { IUserCreator } from '../../definition/accessors/IUserCreator';
import { IUserCreation, UserType } from '../../definition/users';
import { AppBridges } from '../bridges';

export class UserCreator implements IUserCreator {
    constructor(
        private readonly bridges: AppBridges,
        private readonly appId: string,
    ) { }

    public createAppUser(data: IUserCreation): Promise<string> {
        return this.bridges.getUserBridge().create(data, this.appId, UserType.APP);
    }
}
