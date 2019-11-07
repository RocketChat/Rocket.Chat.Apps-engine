import { ISetting } from '../../../src/definition/settings';

import { ServerSettingRead } from '../../../src/server/accessors';
import { IServerSettingBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

let setting: ISetting;
let mockServerSettingBridge: IServerSettingBridge;

beforeAll(() =>  {
    setting = TestData.getSetting('testing');

    const theSetting = setting;
    mockServerSettingBridge = {
        getOneById(id: string, appId: string): Promise<ISetting> {
            return Promise.resolve(id === 'testing' ? theSetting : undefined);
        },
        isReadableById(id: string, appId: string): Promise<boolean> {
            return Promise.resolve(true);
        },
    } as IServerSettingBridge;
});

test('expectDataFromRoomRead', async () => {
    expect(() => new ServerSettingRead(mockServerSettingBridge, 'testing-app')).not.toThrow();

    const ssr = new ServerSettingRead(mockServerSettingBridge, 'testing-app');

    expect(await ssr.getOneById('testing')).toBeDefined();
    expect(await ssr.getOneById('testing')).toEqual(setting);
    expect(await ssr.getValueById('testing')).toEqual(setting.packageValue);
    setting.value = 'theValue';
    expect(await ssr.getValueById('testing')).toBe('theValue');
    await expect(ssr.getValueById('fake')).rejects.toThrowError( 'No Server Setting found, or it is unaccessible, by the id of "fake".');
    await expect(() => ssr.getAll()).toThrowError( 'Method not implemented.');
    expect(await ssr.isReadableById('testing')).toBe(true);
});
