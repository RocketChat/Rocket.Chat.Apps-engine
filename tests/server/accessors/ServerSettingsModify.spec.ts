import { ISetting } from '../../../src/definition/settings';

import { ServerSettingsModify } from '../../../src/server/accessors';
import { IServerSettingBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

let setting: ISetting;
let mockAppId: string;
let mockServerSettingBridge: IServerSettingBridge;

beforeAll(() =>  {
    setting = TestData.getSetting();
    mockAppId = 'testing-app';
    mockServerSettingBridge = {
        hideGroup(name: string, appId: string): Promise<void> {
            return Promise.resolve();
        },
        hideSetting(id: string, appId: string): Promise<void> {
            return Promise.resolve();
        },
        updateOne(settin: ISetting, appId: string): Promise<void> {
            return Promise.resolve();
        },
    } as IServerSettingBridge;
});

test('useServerSettingsModify', async () => {
    expect(() => new ServerSettingsModify(mockServerSettingBridge, mockAppId)).not.toThrow();

    const sp1 = jest.spyOn(mockServerSettingBridge, 'hideGroup');
    const sp2 = jest.spyOn(mockServerSettingBridge, 'hideSetting');
    const sp3 = jest.spyOn(mockServerSettingBridge, 'updateOne');

    const ssm = new ServerSettingsModify(mockServerSettingBridge, mockAppId);

    expect(await ssm.hideGroup('api')).not.toBeDefined();
    expect(mockServerSettingBridge.hideGroup).toHaveBeenCalledWith('api', mockAppId);
    expect(await ssm.hideSetting('api')).not.toBeDefined();
    expect(mockServerSettingBridge.hideSetting).toHaveBeenCalledWith('api', mockAppId);
    expect(await ssm.modifySetting(setting)).not.toBeDefined();
    expect(mockServerSettingBridge.updateOne).toHaveBeenCalledWith(setting, mockAppId);

    sp1.mockClear();
    sp2.mockClear();
    sp3.mockClear();
});
