import { ISetting } from '../../definition/settings';

export interface IServerSettingBridge {
    getAll(appId: string): Promise<Array<ISetting>>;
    doGetAll(appId: string): Promise<Array<ISetting>>;

    getOneById(id: string, appId: string): Promise<ISetting>;
    doGetOneById(id: string, appId: string): Promise<ISetting>;

    hideGroup(name: string, appId: string): Promise<void>;
    doHideGroup(name: string, appId: string): Promise<void>;

    hideSetting(id: string, appId: string): Promise<void>;
    doHideSetting(id: string, appId: string): Promise<void>;

    isReadableById(id: string, appId: string): Promise<boolean>;
    doIsReadableById(id: string, appId: string): Promise<boolean>;

    updateOne(setting: ISetting, appId: string): Promise<void>;
    doUpdateOne(setting: ISetting, appId: string): Promise<void>;
}
