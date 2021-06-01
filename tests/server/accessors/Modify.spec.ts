import { Expect, SetupFixture, Test } from 'alsatian';

import { Modify } from '../../../src/server/accessors';
import { AppBridges, MessageBridge, SchedulerBridge, UiInteractionBridge, UserBridge } from '../../../src/server/bridges';

export class ModifyAccessorTestFixture {
    private mockAppBridges: AppBridges;

    @SetupFixture
    public setupFixture() {
        this.mockAppBridges = {
            getUserBridge(): UserBridge {
                return {} as UserBridge;
            },
            getMessageBridge(): MessageBridge {
                return {} as MessageBridge;
            },
            getUiInteractionBridge(): UiInteractionBridge {
                return {} as UiInteractionBridge;
            },
            getSchedulerBridge() {
                return {} as SchedulerBridge;
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
