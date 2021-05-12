import { IModifyDeleter } from '../../definition/accessors';
import { AppBridges } from '../bridges';

export class ModifyDeleter implements IModifyDeleter {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) { }

    public async deleteRoom(roomId: string): Promise<void> {
        return this.bridges.getRoomBridge().doDelete(roomId, this.appId);
    }
}
