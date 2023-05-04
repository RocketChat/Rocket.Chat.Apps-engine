import { IModifyDeleter } from '../../definition/accessors';
import { IMessage } from '../../definition/messages';
import { AppBridges } from '../bridges';
import { IUser, UserType } from './../../definition/users';

export class ModifyDeleter implements IModifyDeleter {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) {}

    public async deleteRoom(roomId: string): Promise<void> {
        return this.bridges.getRoomBridge().doDelete(roomId, this.appId);
    }

    public async deleteUsers(appId: Exclude<IUser['appId'], undefined>, userType: UserType.APP | UserType.BOT): Promise<boolean> {
        return this.bridges.getUserBridge().doDeleteUsersCreatedByApp(appId, userType);
    }

    public async deleteMessage(message: IMessage, user:IUser): Promise<void> {
        return this.bridges.getMessageBridge().doDelete(message, user, this.appId);
    }
}
