import { IRoom } from '@rocket.chat/apps-ts-definition/rooms';
import { AsyncTest, Expect, SetupFixture } from 'alsatian';

import { RoomRead } from '../../../src/server/accessors';
import { IRoomBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

export class RoomReadAccessorTestFixture {
    private room: IRoom;
    private mockRoomBridgeWithRoom: IRoomBridge;

    @SetupFixture
    public setupFixture() {
        this.room = TestData.getRoom();

        const theRoom = this.room;
        this.mockRoomBridgeWithRoom = {
            getById(id, appId): Promise<IRoom> {
                return Promise.resolve(theRoom);
            },
            getByName(name, appId): Promise<IRoom> {
                return Promise.resolve(theRoom);
            },
        } as IRoomBridge;
    }

    @AsyncTest()
    public async expectDataFromRoomRead() {
        Expect(() => new RoomRead(this.mockRoomBridgeWithRoom, 'testing-app')).not.toThrow();

        const rr = new RoomRead(this.mockRoomBridgeWithRoom, 'testing-app');

        Expect(await rr.getById('fake')).toBeDefined();
        Expect(await rr.getById('fake')).toEqual(this.room);
        Expect(await rr.getByName('testing-room')).toBeDefined();
        Expect(await rr.getByName('testing-room')).toEqual(this.room);
    }

    @AsyncTest()
    // @IgnoreTest()
    public async userTheIterators() {
        Expect(() => new RoomRead(this.mockRoomBridgeWithRoom, 'testing-app')).not.toThrow();

        const rr = new RoomRead(this.mockRoomBridgeWithRoom, 'testing-app');
        await Expect(async () => await rr.getMessages('faker')).toThrowErrorAsync(Error, 'Method not implemented.');
        await Expect(async () => await rr.getMembers('faker')).toThrowErrorAsync(Error, 'Method not implemented.');
    }
}
