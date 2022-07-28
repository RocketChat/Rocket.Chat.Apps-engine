import { IServerSettingUpdater } from '../../definition/accessors';
import { ISetting } from '../../definition/settings';
import { AppBridges } from '../bridges';

export class ServerSettingUpdater implements IServerSettingUpdater {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) { }

    public async updateOne(setting: ISetting): Promise<void> {
        await this.bridges.getServerSettingBridge().doUpdateOne(setting, this.appId);
    }

    public async incrementValue(id: ISetting['id'], value: number = 1): Promise<void> {
        await this.bridges.getServerSettingBridge().doIncrementValue(id, value, this.appId);
    }
}
