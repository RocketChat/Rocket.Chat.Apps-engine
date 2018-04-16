import { ISetting } from '@rocket.chat/apps-ts-definition/settings';

import { IServerSettingBridge } from '../../src/server/bridges';

export class DevServerSettingBridge implements IServerSettingBridge {
    public getAll(appId: string): Promise<Array<ISetting>> {
        throw new Error('Method not implemented.');
    }

    public getOneById(id: string, appId: string): Promise<ISetting> {
        throw new Error('Method not implemented.');
    }

    public hideGroup(name: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public hideSetting(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public isReadableById(id: string, appId: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    public updateOne(setting: ISetting, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
