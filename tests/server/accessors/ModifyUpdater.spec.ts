import { AsyncTest, Expect, SetupFixture, SpyOn } from 'alsatian';
import { IMessage } from '../../../src/definition/messages';
import { IRoom, RoomType } from '../../../src/definition/rooms';

import { MessageBuilder, ModifyUpdater, RoomBuilder } from '../../../src/server/accessors';
import { AppBridges, IMessageBridge, IRoomBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

export class ModifyUpdaterTestFixture {
    private mockAppId: string;
    private mockRoomBridge: IRoomBridge;
    private mockMessageBridge: IMessageBridge;
    private mockAppBridge: AppBridges;

    @SetupFixture
    public setupFixture() {
        this.mockAppId = 'testing-app';

        this.mockRoomBridge = {
            getById(roomId: string, appId: string): Promise<IRoom> {
                return Promise.resolve(TestData.getRoom());
            },
            update(room: IRoom, members: Array<string>, appId: string): Promise<void> {
                return Promise.resolve();
            },
        } as IRoomBridge;

        this.mockMessageBridge = {
            getById(msgId: string, appId: string): Promise<IMessage> {
                return Promise.resolve(TestData.getMessage());
            },
            update(msg: IMessage, appId: string): Promise<void> {
                return Promise.resolve();
            },
        } as IMessageBridge;

        const rmBridge = this.mockRoomBridge;
        const msgBridge = this.mockMessageBridge;
        this.mockAppBridge = {
            getMessageBridge() {
                return msgBridge;
            },
            getRoomBridge() {
                return rmBridge;
            },
        } as AppBridges;
    }

    @AsyncTest()
    public async basicModifyUpdater() {
        Expect(() => new ModifyUpdater(this.mockAppBridge, this.mockAppId)).not.toThrow();

        const mc = new ModifyUpdater(this.mockAppBridge, this.mockAppId);
        Expect(mc.message('msgId', TestData.getUser())).toBeDefined();
        Expect(mc.room('roomId', TestData.getUser())).toBeDefined();

        await Expect(async () => await mc.finish({} as any)).toThrowErrorAsync(Error, 'Invalid builder passed to the ModifyUpdater.finish function.');
    }

    @AsyncTest()
    public async msgModifyUpdater() {
        const mc = new ModifyUpdater(this.mockAppBridge, this.mockAppId);

        const msg = { } as IMessage;
        const msgBd = new MessageBuilder(msg);
        await Expect(async () => await mc.finish(msgBd)).toThrowErrorAsync(Error, 'The "room" property is required.');
        msgBd.setRoom(TestData.getRoom());
        Expect(msg.room).toBeDefined();
        await Expect(async () => await mc.finish(msgBd)).toThrowErrorAsync(Error, 'Invalid message, can not update a message without an id.');
        msg.id = 'testing-msg';
        await Expect(async () => await mc.finish(msgBd)).toThrowErrorAsync(Error, 'Invalid sender assigned to the message.');
        msgBd.setSender(TestData.getUser());
        Expect(msg.sender).toBeDefined();

        const msgBriSpy = SpyOn(this.mockMessageBridge, 'update');
        Expect(await mc.finish(msgBd)).not.toBeDefined();
        Expect(msgBriSpy).toHaveBeenCalledWith(msg, this.mockAppId);
        msgBriSpy.restore();
    }

    @AsyncTest()
    public async roomModifyUpdater() {
        const mc = new ModifyUpdater(this.mockAppBridge, this.mockAppId);

        const room = {} as IRoom;
        const roomBd = new RoomBuilder(room);
        await Expect(async () => await mc.finish(roomBd)).toThrowErrorAsync(Error, 'Invalid room, can not update a room without an id.');
        room.id = 'testing-room';
        await Expect(async () => await mc.finish(roomBd)).toThrowErrorAsync(Error, 'Invalid creator assigned to the room.');
        roomBd.setCreator(TestData.getUser());
        Expect(room.creator).toBeDefined();

        await Expect(async () => await mc.finish(roomBd)).toThrowErrorAsync(Error, 'Invalid slugifiedName assigned to the room.');
        roomBd.setSlugifiedName('testing-room');
        Expect(room.slugifiedName).toBe('testing-room');

        await Expect(async () => await mc.finish(roomBd)).toThrowErrorAsync(Error, 'Invalid displayName assigned to the room.');
        roomBd.setDisplayName('Display Name');
        Expect(room.displayName).toBe('Display Name');

        await Expect(async () => await mc.finish(roomBd)).toThrowErrorAsync(Error, 'Invalid type assigned to the room.');
        roomBd.setType(RoomType.CHANNEL);
        Expect(room.type).toBe(RoomType.CHANNEL);

        const roomBriSpy = SpyOn(this.mockRoomBridge, 'update');
        Expect(await mc.finish(roomBd)).not.toBeDefined();
        Expect(roomBriSpy).toHaveBeenCalledWith(room, roomBd.getMembersToBeAddedUsernames(), this.mockAppId);
        roomBriSpy.restore();
    }
}
