import { IMessage } from '../../../src/definition/messages';
import { IRoom } from '../../../src/definition/rooms';

import { ModifyExtender } from '../../../src/server/accessors';
import { AppBridges, IMessageBridge, IRoomBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

let mockAppId: string;
let mockRoomBridge: IRoomBridge;
let mockMessageBridge: IMessageBridge;
let mockAppBridge: AppBridges;

beforeAll(() =>  {
    mockAppId = 'testing-app';

    mockRoomBridge = {
        getById(roomId: string, appId: string): Promise<IRoom> {
            return Promise.resolve(TestData.getRoom());
        },
        update(room: IRoom, members: Array<string>, appId: string): Promise<void> {
            return Promise.resolve();
        },
    } as IRoomBridge;

    mockMessageBridge = {
        getById(msgId: string, appId: string): Promise<IMessage> {
            return Promise.resolve(TestData.getMessage());
        },
        update(msg: IMessage, appId: string): Promise<void> {
            return Promise.resolve();
        },
    } as IMessageBridge;

    const rmBridge = mockRoomBridge;
    const msgBridge = mockMessageBridge;
    mockAppBridge = {
        getMessageBridge() {
            return msgBridge;
        },
        getRoomBridge() {
            return rmBridge;
        },
    } as AppBridges;
});

test('useModifyExtender', async () => {
    expect(() => new ModifyExtender(mockAppBridge, mockAppId)).not.toThrow();

    const me = new ModifyExtender(mockAppBridge, mockAppId);

    jest.spyOn(mockRoomBridge, 'getById');
    jest.spyOn(mockRoomBridge, 'update');
    jest.spyOn(mockMessageBridge, 'getById');
    jest.spyOn(mockMessageBridge, 'update');

    expect(await me.extendRoom('roomId', TestData.getUser())).toBeDefined();
    expect(mockRoomBridge.getById).toHaveBeenCalledWith('roomId', mockAppId);
    expect(await me.extendMessage('msgId', TestData.getUser())).toBeDefined();
    expect(mockMessageBridge.getById).toHaveBeenCalledWith('msgId', mockAppId);

    await expect(() => me.finish({} as any)).toThrowError( 'Invalid extender passed to the ModifyExtender.finish function.');
    expect(await me.finish(await me.extendRoom('roomId', TestData.getUser()))).not.toBeDefined();
    expect(mockRoomBridge.update).toHaveBeenCalled();
    expect(await me.finish(await me.extendMessage('msgId', TestData.getUser()))).not.toBeDefined();
    expect(mockMessageBridge.update).toHaveBeenCalled();
});
