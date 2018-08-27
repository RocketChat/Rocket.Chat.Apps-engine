import { AsyncTest, Expect, SetupFixture } from 'alsatian';
import { ISetting } from '../../../src/definition/settings';

import { ServerSettingRead } from '../../../src/server/accessors';
import { IServerSettingBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

export class ServerSettingReadAccessorTestFixture {
    private setting: ISetting;
    private mockServerSettingBridge: IServerSettingBridge;

    @SetupFixture
    public setupFixture() {
        this.setting = TestData.getSetting('testing');

        const theSetting = this.setting;
        this.mockServerSettingBridge = {
            getOneById(id: string, appId: string): Promise<ISetting> {
                return Promise.resolve(id === 'testing' ? theSetting : undefined);
            },
            isReadableById(id: string, appId: string): Promise<boolean> {
                return Promise.resolve(true);
            },
        } as IServerSettingBridge;
    }

    @AsyncTest()
    public async expectDataFromRoomRead() {
        Expect(() => new ServerSettingRead(this.mockServerSettingBridge, 'testing-app')).not.toThrow();

        const ssr = new ServerSettingRead(this.mockServerSettingBridge, 'testing-app');

        Expect(await ssr.getOneById('testing')).toBeDefined();
        Expect(await ssr.getOneById('testing')).toEqual(this.setting);
        Expect(await ssr.getValueById('testing')).toEqual(this.setting.packageValue);
        this.setting.value = 'theValue';
        Expect(await ssr.getValueById('testing')).toBe('theValue');
        await Expect(async () => ssr.getValueById('fake')).toThrowErrorAsync(Error, 'No Server Setting found, or it is unaccessible, by the id of "fake".');
        await Expect(async () => await ssr.getAll()).toThrowErrorAsync(Error, 'Method not implemented.');
        Expect(await ssr.isReadableById('testing')).toBe(true);
    }
}
