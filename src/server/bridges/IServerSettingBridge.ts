import { ISetting } from '@rocket.chat/apps-ts-definition/settings';

export interface IServerSettingBridge {
    getAll(appId: string): Array<ISetting>;

    getOneById(id: string, appId: string): ISetting;

    hideGroup(name: string, appId: string): void;

    hideSetting(id: string, appId: string): void;

    isReadableById(id: string, appId: string): boolean;

    updateOne(setting: ISetting, appId: string): void;
}
