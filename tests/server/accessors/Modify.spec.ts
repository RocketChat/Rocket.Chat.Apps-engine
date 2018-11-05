import { Expect, SetupFixture, Test } from 'alsatian';

import { IConfigurationModify } from '../../../src/definition/accessors';
import { Modify } from '../../../src/server/accessors';
import { AppBridges, IMessageBridge } from '../../../src/server/bridges';

export class ModifyAccessorTestFixture {
    private mockAppBridges: AppBridges;
    private mockConfig: IConfigurationModify;

    @SetupFixture
    public setupFixture() {
        this.mockAppBridges = {
            getMessageBridge(): IMessageBridge {
                return {} as IMessageBridge;
            },
        } as AppBridges;

        this.mockConfig = {} as IConfigurationModify;
    }

    @Test()
    public useModify() {
        Expect(() => new Modify(this.mockAppBridges, this.mockConfig, 'testing')).not.toThrow();

        const md = new Modify(this.mockAppBridges, this.mockConfig, 'testing');
        Expect(md.getCreator()).toBeDefined();
        Expect(md.getExtender()).toBeDefined();
        Expect(md.getNotifier()).toBeDefined();
        Expect(md.getUpdater()).toBeDefined();
    }
}
