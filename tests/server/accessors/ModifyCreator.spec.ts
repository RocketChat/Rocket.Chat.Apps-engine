import { AsyncTest, Expect, SetupFixture, SpyOn } from 'alsatian';
import { IMessage } from '../../../src/definition/messages';
import { IRoom, RoomType } from '../../../src/definition/rooms';
import { IUser, UserStatusConnection, UserType } from '../../../src/definition/users';
import { ModifyCreator } from '../../../src/server/accessors';
import { AppBridges, IMessageBridge, IRoomBridge, IUserBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

export class ModifyCreatorTestFixture {
    private mockAppId: string;
    private mockRoomBridge: IRoomBridge;
    private mockMessageBridge: IMessageBridge;
    private mockAppBridge: AppBridges;
    private mockAppUser: IUser;
    private mockUserBridge: IUserBridge;

    @SetupFixture
    public setupFixture() {
        this.mockAppId = 'testing-app';

        this.mockAppUser = {
            id: 'mockAppUser',
            isEnabled: true,
            name: 'mockAppUser',
            roles: ['app'],
            status: 'online',
            statusConnection: UserStatusConnection.UNDEFINED,
            type: UserType.APP,
            username: 'mockAppUser',
        };

        this.mockRoomBridge = {
            create(room: IRoom, members: Array<string>, appId: string): Promise<string> {
                return Promise.resolve('roomId');
            },
        } as IRoomBridge;

        this.mockMessageBridge = {
            create(msg: IMessage, appId: string): Promise<string> {
                return Promise.resolve('msgId');
            },
        } as IMessageBridge;

        this.mockUserBridge = {
            getAppUser: (appId: string) => {
                return Promise.resolve(this.mockAppUser);
            },
        } as IUserBridge;

        this.mockAppBridge = {
            getMessageBridge: () => this.mockMessageBridge,
            getRoomBridge: () => this.mockRoomBridge,
            getUserBridge: () => this.mockUserBridge,
        } as AppBridges;
    }

    @AsyncTest()
    public async basicModifyCreator() {
        Expect(() => new ModifyCreator(this.mockAppBridge, this.mockAppId)).not.toThrow();

        const mc = new ModifyCreator(this.mockAppBridge, this.mockAppId);
        Expect(mc.startMessage()).toBeDefined();
        Expect(mc.startMessage({ id: 'value' } as IMessage)).toBeDefined();
        Expect(mc.startRoom()).toBeDefined();
        Expect(mc.startRoom({ id: 'value' } as IRoom)).toBeDefined();

        await Expect(async () => await mc.finish({} as any)).toThrowErrorAsync(Error, 'Invalid builder passed to the ModifyCreator.finish function.');
    }

    @AsyncTest()
    public async msgModifyCreator() {
        const mc = new ModifyCreator(this.mockAppBridge, this.mockAppId);

        const msg = {} as IMessage;
        const msgBd = mc.startMessage(msg);
        await Expect(async () => await mc.finish(msgBd)).toThrowErrorAsync(Error, 'The "room" property is required.');
        msgBd.setRoom(TestData.getRoom());
        Expect(msg.room).toBeDefined();
        await Expect(async () => await mc.finish(msgBd)).not.toThrowErrorAsync(Error, 'Invalid sender assigned to the message.');
        msgBd.setSender(TestData.getUser());
        Expect(msg.sender).toBeDefined();

        const msgBriSpy = SpyOn(this.mockMessageBridge, 'create');
        Expect(await mc.finish(msgBd)).toBe('msgId');
        Expect(msgBriSpy).toHaveBeenCalledWith(msg, this.mockAppId);
        msgBriSpy.restore();
    }

    @AsyncTest()
    public async roomModifyCreator() {
        const mc = new ModifyCreator(this.mockAppBridge, this.mockAppId);

        const room = {} as IRoom;
        const roomBd = mc.startRoom(room);
        await Expect(async () => await mc.finish(roomBd)).toThrowErrorAsync(Error, 'Invalid type assigned to the room.');
        roomBd.setType(RoomType.CHANNEL);
        Expect(room.type).toBe(RoomType.CHANNEL);

        await Expect(async () => await mc.finish(roomBd)).toThrowErrorAsync(Error, 'Invalid creator assigned to the room.');
        roomBd.setCreator(TestData.getUser());
        Expect(room.creator).toBeDefined();

        await Expect(async () => await mc.finish(roomBd)).toThrowErrorAsync(Error, 'Invalid slugifiedName assigned to the room.');
        roomBd.setSlugifiedName('testing-room');
        Expect(room.slugifiedName).toBe('testing-room');

        await Expect(async () => await mc.finish(roomBd)).toThrowErrorAsync(Error, 'Invalid displayName assigned to the room.');
        roomBd.setDisplayName('Display Name');
        Expect(room.displayName).toBe('Display Name');

        const roomBriSpy = SpyOn(this.mockRoomBridge, 'create');
        Expect(await mc.finish(roomBd)).toBe('roomId');
        Expect(roomBriSpy).toHaveBeenCalledWith(room, roomBd.getMembersToBeAddedUsernames(), this.mockAppId);
        roomBriSpy.restore();
    }
}
