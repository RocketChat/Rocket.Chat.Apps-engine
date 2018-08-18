import { ISetting } from '../../definition/settings';
export interface IServerSettingBridge {
    getAll(appId: string): Promise<Array<ISetting>>;
    getOneById(id: string, appId: string): Promise<ISetting>;
    hideGroup(name: string, appId: string): Promise<void>;
    hideSetting(id: string, appId: string): Promise<void>;
    isReadableById(id: string, appId: string): Promise<boolean>;
    updateOne(setting: ISetting, appId: string): Promise<void>;
}
