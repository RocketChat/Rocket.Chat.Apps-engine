import { AsyncTest, Expect, SetupFixture } from 'alsatian';
import { IMessage } from '../../../src/definition/messages';
import { IRoom } from '../../../src/definition/rooms';
import { IUser } from '../../../src/definition/users';

import { MessageBuilder, Notifier } from '../../../src/server/accessors';
import { IMessageBridge, UserBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

export class NotifierAccessorTestFixture {
    private mockUserBridge: UserBridge;
    private mockMsgBridge: IMessageBridge;

    @SetupFixture
    public setupFixture() {
        this.mockMsgBridge = {
            doNotifyUser(user: IUser, msg: IMessage, appId: string): Promise<void> {
                // TODO: Spy on these and ensure they're called with the right parameters
                return Promise.resolve();
            },
            doNotifyRoom(room: IRoom, msg: IMessage, appId: string): Promise<void> {
                return Promise.resolve();
            },
        } as IMessageBridge;
    }

    @AsyncTest()
    public async useNotifier() {
        Expect(() => new Notifier(this.mockUserBridge, this.mockMsgBridge, 'testing')).not.toThrow();

        const noti = new Notifier(this.mockUserBridge, this.mockMsgBridge, 'testing');
        await Expect(async () => await noti.notifyRoom(TestData.getRoom(), TestData.getMessage())).not.toThrowAsync();
        await Expect(async () => await noti.notifyUser(TestData.getUser(), TestData.getMessage())).not.toThrowAsync();
        Expect(noti.getMessageBuilder() instanceof MessageBuilder).toBe(true);
    }
}
