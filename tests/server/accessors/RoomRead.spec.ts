import { AsyncTest, Expect, SetupFixture } from 'alsatian';
import { IRoom } from '../../../src/definition/rooms';
import { IUser } from '../../../src/definition/users';

import { RoomRead } from '../../../src/server/accessors';
import { IRoomBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

export class RoomReadAccessorTestFixture {
    private room: IRoom;
    private user: IUser;
    private userIterator: IterableIterator<IUser>;
    private mockRoomBridgeWithRoom: IRoomBridge;

    @SetupFixture
    public setupFixture() {
        this.room = TestData.getRoom();
        this.user = TestData.getUser();
        this.userIterator = TestData.getUserIterator(this.user);

        const theRoom = this.room;
        const theUser = this.user;
        const theUserIterator = this.userIterator;
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

            getMembers(name, appId): Promise<IterableIterator<IUser>> {
                return Promise.resolve(theUserIterator);
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
    }

    @AsyncTest()
    public async useTheIterators() {
        Expect(() => new RoomRead(this.mockRoomBridgeWithRoom, 'testing-app')).not.toThrow();

        const rr = new RoomRead(this.mockRoomBridgeWithRoom, 'testing-app');
        await Expect(async () => await rr.getMessages('faker')).toThrowErrorAsync(Error, 'Method not implemented.');

        Expect(await rr.getMembers('testing-room')).toBeDefined();
        Expect((await rr.getMembers('testing-room')).next()).toBe(this.user);
    }
}
