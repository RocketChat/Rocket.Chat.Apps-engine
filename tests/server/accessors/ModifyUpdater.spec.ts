import { IMessage } from '../../../src/definition/messages';
import { IRoom, RoomType } from '../../../src/definition/rooms';

import { ILivechatRoom } from '../../../src/definition/livechat/ILivechatRoom';
import { MessageBuilder, ModifyUpdater, RoomBuilder } from '../../../src/server/accessors';
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

test('asicModifyUpdater', async () => {
    expect(() => new ModifyUpdater(mockAppBridge, mockAppId)).not.toThrow();

    const mc = new ModifyUpdater(mockAppBridge, mockAppId);
    expect(mc.message('msgId', TestData.getUser())).toBeDefined();
    expect(mc.room('roomId', TestData.getUser())).toBeDefined();

    await expect(() => mc.finish({} as any)).toThrowError( 'Invalid builder passed to the ModifyUpdater.finish function.');
});

test('msgModifyUpdater', async () => {
    const mc = new ModifyUpdater(mockAppBridge, mockAppId);

    const msg = { } as IMessage;
    const msgBd = new MessageBuilder(msg);
    await expect(() => mc.finish(msgBd)).toThrowError( 'The "room" property is required.');
    msgBd.setRoom(TestData.getRoom());
    expect(msg.room).toBeDefined();
    await expect(() => mc.finish(msgBd)).toThrowError( 'Invalid message, can not update a message without an id.');
    msg.id = 'testing-msg';
    await expect(() => mc.finish(msgBd)).toThrowError( 'Invalid sender assigned to the message.');
    msgBd.setSender(TestData.getUser());
    expect(msg.sender).toBeDefined();

    const msgBriSpy = jest.spyOn(mockMessageBridge, 'update');
    expect(await mc.finish(msgBd)).not.toBeDefined();
    expect(msgBriSpy).toHaveBeenCalledWith(msg, mockAppId);
    msgBriSpy.mockClear();
});

test('roomModifyUpdater', async () => {
    const mc = new ModifyUpdater(mockAppBridge, mockAppId);

    const room = {} as IRoom;
    const roomBd = new RoomBuilder(room);
    await expect(() => mc.finish(roomBd)).toThrowError( 'Invalid room, can not update a room without an id.');
    room.id = 'testing-room';

    await expect(() => mc.finish(roomBd)).toThrowError( 'Invalid type assigned to the room.');
    roomBd.setType(RoomType.CHANNEL);
    expect(room.type).toBe(RoomType.CHANNEL);

    await expect(() => mc.finish(roomBd)).toThrowError( 'Invalid creator assigned to the room.');
    roomBd.setCreator(TestData.getUser());
    expect(room.creator).toBeDefined();

    await expect(() => mc.finish(roomBd)).toThrowError( 'Invalid slugifiedName assigned to the room.');
    roomBd.setSlugifiedName('testing-room');
    expect(room.slugifiedName).toBe('testing-room');

    await expect(() => mc.finish(roomBd)).toThrowError( 'Invalid displayName assigned to the room.');
    roomBd.setDisplayName('Display Name');
    expect(room.displayName).toBe('Display Name');

    const roomBriSpy = jest.spyOn(mockRoomBridge, 'update');
    expect(await mc.finish(roomBd)).not.toBeDefined();
    expect(roomBriSpy).toHaveBeenCalledWith(room, roomBd.getMembersToBeAddedUsernames(), mockAppId);
    roomBriSpy.mockClear();
});

test('livechatRoomModifyUpdater', async () => {
    const mc = new ModifyUpdater(mockAppBridge, mockAppId);

    const room = {} as ILivechatRoom;
    const roomBd = new RoomBuilder(room);
    await expect(() => mc.finish(roomBd)).toThrowError( 'Invalid room, can not update a room without an id.');
    room.id = 'testing-room';

    await expect(() => mc.finish(roomBd)).toThrowError( 'Invalid type assigned to the room.');
    roomBd.setType(RoomType.LIVE_CHAT);
    expect(room.type).toBe(RoomType.LIVE_CHAT);

    await expect(() => mc.finish(roomBd)).toThrowError( 'Invalid displayName assigned to the room.');
    roomBd.setDisplayName('Display Name');
    expect(room.displayName).toBe('Display Name');

    const roomBriSpy = jest.spyOn(mockRoomBridge, 'update');
    expect(await mc.finish(roomBd)).not.toBeDefined();
    expect(roomBriSpy).toHaveBeenCalledWith(room, roomBd.getMembersToBeAddedUsernames(), mockAppId);
    roomBriSpy.mockClear();
});
