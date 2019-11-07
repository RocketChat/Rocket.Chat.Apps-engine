import { IMessage } from '../../../src/definition/messages';
import { IRoom, RoomType } from '../../../src/definition/rooms';

import { ModifyCreator } from '../../../src/server/accessors';
import { AppBridges, IMessageBridge, IRoomBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

let mockAppId: string;
let mockRoomBridge: IRoomBridge;
let mockMessageBridge: IMessageBridge;
let mockAppBridge: AppBridges;

beforeAll(() =>  {
    mockAppId = 'testing-app';

    mockRoomBridge = {
        create(room: IRoom, members: Array<string>, appId: string): Promise<string> {
            return Promise.resolve('roomId');
        },
    } as IRoomBridge;

    mockMessageBridge = {
        create(msg: IMessage, appId: string): Promise<string> {
            return Promise.resolve('msgId');
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

test('basicModifyCreator', async () => {
    expect(() => new ModifyCreator(mockAppBridge, mockAppId)).not.toThrow();

    const mc = new ModifyCreator(mockAppBridge, mockAppId);
    expect(mc.startMessage()).toBeDefined();
    expect(mc.startMessage({ id: 'value' } as IMessage)).toBeDefined();
    expect(mc.startRoom()).toBeDefined();
    expect(mc.startRoom({ id: 'value' } as IRoom)).toBeDefined();

    await expect(() => mc.finish({} as any)).toThrowError('Invalid builder passed to the ModifyCreator.finish function.');
});

test('msgModifyCreator', async () => {
    const mc = new ModifyCreator(mockAppBridge, mockAppId);

    const msg = {} as IMessage;
    const msgBd = mc.startMessage(msg);
    await expect(() => mc.finish(msgBd)).toThrowError( 'The "room" property is required.');
    msgBd.setRoom(TestData.getRoom());
    expect(msg.room).toBeDefined();
    await expect(() => mc.finish(msgBd)).toThrowError( 'Invalid sender assigned to the message.');
    msgBd.setSender(TestData.getUser());
    expect(msg.sender).toBeDefined();

    const msgBriSpy = jest.spyOn(mockMessageBridge, 'create');
    expect(await mc.finish(msgBd)).toBe('msgId');
    expect(msgBriSpy).toHaveBeenCalledWith(msg, mockAppId);
    msgBriSpy.mockClear();
});

test('roomModifyCreator', async () => {
    const mc = new ModifyCreator(mockAppBridge, mockAppId);

    const room = {} as IRoom;
    const roomBd = mc.startRoom(room);
    await expect(() => mc.finish(roomBd)).toThrowError('Invalid type assigned to the room.');
    roomBd.setType(RoomType.CHANNEL);
    expect(room.type).toBe(RoomType.CHANNEL);

    await expect(() => mc.finish(roomBd)).toThrowError('Invalid creator assigned to the room.');
    roomBd.setCreator(TestData.getUser());
    expect(room.creator).toBeDefined();

    await expect(() => mc.finish(roomBd)).toThrowError('Invalid slugifiedName assigned to the room.');
    roomBd.setSlugifiedName('testing-room');
    expect(room.slugifiedName).toBe('testing-room');

    await expect(() => mc.finish(roomBd)).toThrowError('Invalid displayName assigned to the room.');
    roomBd.setDisplayName('Display Name');
    expect(room.displayName).toBe('Display Name');

    const roomBriSpy = jest.spyOn(mockRoomBridge, 'create');
    expect(await mc.finish(roomBd)).toBe('roomId');
    expect(roomBriSpy).toHaveBeenCalledWith(room, roomBd.getMembersToBeAddedUsernames(), mockAppId);
    roomBriSpy.mockClear();
});
