import { IRoomUpdater } from '../../definition/accessors/IRoomUpdater';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';
import { AppBridges } from '../bridges';

export class RoomUpdater implements IRoomUpdater {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) {
    }

    public async muteUser(room: IRoom, executor: IUser, user: IUser) {
        return this.bridges.getRoomBridge().doMuteUser(room.id, executor.id, user.id, this.appId);
    }

    public async unmuteUser(room: IRoom, executor: IUser, user: IUser) {
        return this.bridges.getRoomBridge().doUnmuteUser(room.id, executor.id, user.id, this.appId);
    }

    public async hideRoom(room: IRoom, executor: IUser): Promise<void> {
        return this.bridges.getRoomBridge().doHideRoom(room.id, executor.id, this.appId);
    }
}
