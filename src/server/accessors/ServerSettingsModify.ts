import { IServerSettingBridge } from '../bridges/IServerSettingBridge';

import { IServerSettingsModify } from '../../definition/accessors';
import { ISetting } from '../../definition/settings';

export class ServerSettingsModify implements IServerSettingsModify {
    constructor(private readonly bridge: IServerSettingBridge, private readonly appId: string) { }

    public async hideGroup(name: string): Promise<void> {
        await this.bridge.hideGroup(name, this.appId);
    }

    public async hideSetting(id: string): Promise<void> {
        await this.bridge.hideSetting(id, this.appId);
    }

    public async modifySetting(setting: ISetting): Promise<void> {
        await this.bridge.updateOne(setting, this.appId);
    }
}
