import { ISetting } from '../../definition/settings';

export interface IServerSettingBridge {
    doGetAll(appId: string): Promise<Array<ISetting>>;
    doGetOneById(id: string, appId: string): Promise<ISetting>;
    doHideGroup(name: string, appId: string): Promise<void>;
    doHideSetting(id: string, appId: string): Promise<void>;
    doIsReadableById(id: string, appId: string): Promise<boolean>;
    doUpdateOne(setting: ISetting, appId: string): Promise<void>;
}
