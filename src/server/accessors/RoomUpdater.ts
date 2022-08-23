import { IRoomUpdater } from '../../definition/accessors/IRoomUpdater';
import { IRoom } from '../../definition/rooms';
import { AppBridges } from '../bridges';

export class RoomUpdater implements IRoomUpdater {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) {}
    public async archiveRoom(room: IRoom): Promise<boolean> {
        return this.bridges.getRoomBridge().doArchiveRoom(room, this.appId);
    }
    public async unarchiveRoom(room: IRoom): Promise<boolean> {
        return this.bridges.getRoomBridge().doUnarchiveRoom(room, this.appId);
    }
}
