import { Expect, SetupFixture, Test } from 'alsatian';

import { Modify } from '../../../src/server/accessors';
import { AppBridges, IAppSchedulerBridge, IMessageBridge, IUiInteractionBridge, IUserBridge } from '../../../src/server/bridges';

export class ModifyAccessorTestFixture {
    private mockAppBridges: AppBridges;

    @SetupFixture
    public setupFixture() {
        this.mockAppBridges = {
            getUserBridge(): IUserBridge {
                return {} as IUserBridge;
            },
            getMessageBridge(): IMessageBridge {
                return {} as IMessageBridge;
            },
            getUiInteractionBridge(): IUiInteractionBridge {
                return {} as IUiInteractionBridge;
            },
            getSchedulerBridge() {
                return {} as IAppSchedulerBridge;
            },
        } as AppBridges;
    }

    @Test()
    public useModify() {
        Expect(() => new Modify(this.mockAppBridges, 'testing')).not.toThrow();

        const md = new Modify(this.mockAppBridges, 'testing');
        Expect(md.getCreator()).toBeDefined();
        Expect(md.getExtender()).toBeDefined();
        Expect(md.getNotifier()).toBeDefined();
        Expect(md.getUpdater()).toBeDefined();
    }
}
