import type { IUser, UserType } from './../../definition/users';
import { IModifyDeleter } from '../../definition/accessors';
import { AppBridges } from '../bridges';

export class ModifyDeleter implements IModifyDeleter {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) {}

    public async deleteRoom(roomId: string): Promise<void> {
        return this.bridges.getRoomBridge().doDelete(roomId, this.appId);
    }

    public async deleteBotUser(appId: Exclude<IUser['appId'], undefined>, type: UserType.BOT): Promise<boolean> {
        return this.bridges.getUserBridge().doDeleteUsersCreatedByApp(appId, type);
    }
}
