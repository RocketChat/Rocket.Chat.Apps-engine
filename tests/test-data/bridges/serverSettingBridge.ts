import { ISetting } from '../../../src/definition/settings';

import { IServerSettingBridge } from '../../../src/server/bridges';

export class TestsServerSettingBridge implements IServerSettingBridge {
    public doGetAll(appId: string): Promise<Array<ISetting>> {
        throw new Error('Method not implemented.');
    }

    public doGetOneById(id: string, appId: string): Promise<ISetting> {
        throw new Error('Method not implemented.');
    }

    public doHideGroup(name: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public doHideSetting(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public doIsReadableById(id: string, appId: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    public doUpdateOne(setting: ISetting, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
