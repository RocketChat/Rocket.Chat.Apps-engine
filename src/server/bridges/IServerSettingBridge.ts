import { ISetting } from 'temporary-rocketlets-ts-definition/settings';

export interface IServerSettingBridge {
    getAll(rocketletId: string): Array<ISetting>;

    getOneById(id: string, rocketletId: string): ISetting;

    hideGroup(name: string, rocketletId: string): void;

    hideSetting(id: string, rocketletId: string): void;

    isReadableById(id: string, rocketletId: string): boolean;

    updateOne(setting: ISetting, rocketletId: string): void;
}
