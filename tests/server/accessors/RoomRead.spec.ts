import { AsyncTest, Expect, SetupFixture } from 'alsatian';
import { IMessage } from '../../../src/definition/messages';
import { IRoom } from '../../../src/definition/rooms';
import { IUser } from '../../../src/definition/users';

import { RoomRead } from '../../../src/server/accessors';
import { IRoomBridge } from '../../../src/server/bridges';
import { EmptyAsyncIterableIterator, TestData } from '../../test-data/utilities';

export class RoomReadAccessorTestFixture {
    private room: IRoom;
    private user: IUser;
    private msgIterator: AsyncIterableIterator<IMessage>;
    private mockRoomBridgeWithRoom: IRoomBridge;

    @SetupFixture
    public setupFixture() {
        this.room = TestData.getRoom();
        this.user = TestData.getUser();
        this.msgIterator = new EmptyAsyncIterableIterator<IMessage>();

        const theRoom = this.room;
        const theUser = this.user;
        const theIterator = this.msgIterator;
        this.mockRoomBridgeWithRoom = {
            getById(id, appId): Promise<IRoom> {
                return Promise.resolve(theRoom);
            },
            getByName(name, appId): Promise<IRoom> {
                return Promise.resolve(theRoom);
            },
            getCreatorById(id, appId): Promise<IUser> {
                return Promise.resolve(theUser);
            },
            getCreatorByName(name, appId): Promise<IUser> {
                return Promise.resolve(theUser);
            },
            getDirectByUsernames(usernames, appId): Promise<IRoom> {
                return Promise.resolve(theRoom);
            },
            getMembers(name, appId): Promise<Array<IUser>> {
                return Promise.resolve([theUser]);
            },
            getMessages(roomId, appId): Promise<AsyncIterableIterator<IMessage>> {
                return Promise.resolve(theIterator);
            },
        } as IRoomBridge;
    }

    @AsyncTest()
    public async expectDataFromRoomRead() {
        Expect(() => new RoomRead(this.mockRoomBridgeWithRoom, 'testing-app')).not.toThrow();

        const rr = new RoomRead(this.mockRoomBridgeWithRoom, 'testing-app');

        Expect(await rr.getById('fake')).toBeDefined();
        Expect(await rr.getById('fake')).toBe(this.room);
        Expect(await rr.getByName('testing-room')).toBeDefined();
        Expect(await rr.getByName('testing-room')).toBe(this.room);
        Expect(await rr.getCreatorUserById('testing')).toBeDefined();
        Expect(await rr.getCreatorUserById('testing')).toBe(this.user);
        Expect(await rr.getCreatorUserByName('testing')).toBeDefined();
        Expect(await rr.getCreatorUserByName('testing')).toBe(this.user);
        Expect(await rr.getDirectByUsernames([this.user.username])).toBeDefined();
        Expect(await rr.getDirectByUsernames([this.user.username])).toBe(this.room);
        Expect(await rr.getMessages('testing')).toBeDefined();
        Expect(await rr.getMessages('testing')).toBe(this.msgIterator);
    }

    @AsyncTest()
    public async useTheIterators() {
        Expect(() => new RoomRead(this.mockRoomBridgeWithRoom, 'testing-app')).not.toThrow();

        const rr = new RoomRead(this.mockRoomBridgeWithRoom, 'testing-app');

        Expect(await rr.getMembers('testing')).toBeDefined();
        Expect(await rr.getMembers('testing') as Array<IUser>).not.toBeEmpty();
        Expect((await rr.getMembers('testing'))[0]).toBe(this.user);
    }
}
