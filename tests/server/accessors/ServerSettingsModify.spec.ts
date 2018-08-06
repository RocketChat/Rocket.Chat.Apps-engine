import { AsyncTest, Expect, SetupFixture, SpyOn } from 'alsatian';
import { ISetting } from '../../../src/definition/settings';

import { ServerSettingsModify } from '../../../src/server/accessors';
import { IServerSettingBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

export class ServerSettingsModifyTestFixture {
    private setting: ISetting;
    private mockAppId: string;
    private mockServerSettingBridge: IServerSettingBridge;

    @SetupFixture
    public setupFixture() {
        this.setting = TestData.getSetting();
        this.mockAppId = 'testing-app';
        this.mockServerSettingBridge = {
            hideGroup(name: string, appId: string): Promise<void> {
                return Promise.resolve();
            },
            hideSetting(id: string, appId: string): Promise<void> {
                return Promise.resolve();
            },
            updateOne(setting: ISetting, appId: string): Promise<void> {
                return Promise.resolve();
            },
        } as IServerSettingBridge;
    }

    @AsyncTest()
    public async useServerSettingsModify() {
        Expect(() => new ServerSettingsModify(this.mockServerSettingBridge, this.mockAppId)).not.toThrow();

        const sp1 = SpyOn(this.mockServerSettingBridge, 'hideGroup');
        const sp2 = SpyOn(this.mockServerSettingBridge, 'hideSetting');
        const sp3 = SpyOn(this.mockServerSettingBridge, 'updateOne');

        const ssm = new ServerSettingsModify(this.mockServerSettingBridge, this.mockAppId);

        Expect(await ssm.hideGroup('api')).not.toBeDefined();
        Expect(this.mockServerSettingBridge.hideGroup).toHaveBeenCalledWith('api', this.mockAppId);
        Expect(await ssm.hideSetting('api')).not.toBeDefined();
        Expect(this.mockServerSettingBridge.hideSetting).toHaveBeenCalledWith('api', this.mockAppId);
        Expect(await ssm.modifySetting(this.setting)).not.toBeDefined();
        Expect(this.mockServerSettingBridge.updateOne).toHaveBeenCalledWith(this.setting, this.mockAppId);

        sp1.restore();
        sp2.restore();
        sp3.restore();
    }
}
