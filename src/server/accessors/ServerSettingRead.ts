import { IServerSettingBridge } from '../bridges/IServerSettingBridge';

import { IServerSettingRead } from '../../definition/accessors';
import { ISetting } from '../../definition/settings';

export class ServerSettingRead implements IServerSettingRead {
    constructor(private readonly settingBridge: IServerSettingBridge, private readonly appId: string) { }

    public getOneById(id: string): Promise<ISetting> {
        return this.settingBridge.getOneById(id, this.appId);
    }

    public async getValueById(id: string): Promise<any> {
        const set = await this.settingBridge.getOneById(id, this.appId);

        if (typeof set === 'undefined') {
            throw new Error(`No Server Setting found, or it is unaccessible, by the id of "${id}".`);
        }

        return set.value || set.packageValue;
    }

    public getAll(): Promise<AsyncIterableIterator<ISetting>> {
        throw new Error('Method not implemented.');
        // return this.settingBridge.getAll(this.appId);
    }

    public isReadableById(id: string): Promise<boolean> {
        return this.settingBridge.isReadableById(id, this.appId);
    }
}
