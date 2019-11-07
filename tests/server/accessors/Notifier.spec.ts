import { IMessage } from '../../../src/definition/messages';
import { IRoom } from '../../../src/definition/rooms';
import { IUser } from '../../../src/definition/users';

import { MessageBuilder, Notifier } from '../../../src/server/accessors';
import { IMessageBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

let mockMsgBridge: IMessageBridge;

beforeAll(() =>  {
    mockMsgBridge = {
        notifyUser(user: IUser, msg: IMessage, appId: string): Promise<void> {
            // TODO: Spy on these and ensure they're called with the right parameters
            return Promise.resolve();
        },
        notifyRoom(room: IRoom, msg: IMessage, appId: string): Promise<void> {
            return Promise.resolve();
        },
    } as IMessageBridge;
});

test('useNotifier', async () => {
    expect(() => new Notifier(mockMsgBridge, 'testing')).not.toThrow();

    const noti = new Notifier(mockMsgBridge, 'testing');
    await expect(async () => await noti.notifyRoom(TestData.getRoom(), TestData.getMessage())).not.toThrowError();
    await expect(async () => await noti.notifyUser(TestData.getUser(), TestData.getMessage())).not.toThrowError();
    expect(noti.getMessageBuilder() instanceof MessageBuilder).toBe(true);
});
