import { IServerSettingBridge } from '../bridges/IServerSettingBridge';
import { IServerSettingsModify } from '../../definition/accessors';
import { ISetting } from '../../definition/settings';
export declare class ServerSettingsModify implements IServerSettingsModify {
    private readonly bridge;
    private readonly appId;
    constructor(bridge: IServerSettingBridge, appId: string);
    hideGroup(name: string): Promise<void>;
    hideSetting(id: string): Promise<void>;
    modifySetting(setting: ISetting): Promise<void>;
}
