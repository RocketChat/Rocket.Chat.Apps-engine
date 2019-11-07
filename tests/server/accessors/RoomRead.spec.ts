import { IRoom } from '../../../src/definition/rooms';
import { IUser } from '../../../src/definition/users';

import { RoomRead } from '../../../src/server/accessors';
import { IRoomBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

let room: IRoom;
let user: IUser;
let mockRoomBridgeWithRoom: IRoomBridge;

beforeAll(() =>  {
    room = TestData.getRoom();
    user = TestData.getUser();

    const theRoom = room;
    const theUser = user;
    mockRoomBridgeWithRoom = {
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
    } as IRoomBridge;
});

test('expectDataFromRoomRead', async () => {
    expect(() => new RoomRead(mockRoomBridgeWithRoom, 'testing-app')).not.toThrow();

    const rr = new RoomRead(mockRoomBridgeWithRoom, 'testing-app');

    expect(await rr.getById('fake')).toBeDefined();
    expect(await rr.getById('fake')).toBe(room);
    expect(await rr.getByName('testing-room')).toBeDefined();
    expect(await rr.getByName('testing-room')).toBe(room);
    expect(await rr.getCreatorUserById('testing')).toBeDefined();
    expect(await rr.getCreatorUserById('testing')).toBe(user);
    expect(await rr.getCreatorUserByName('testing')).toBeDefined();
    expect(await rr.getCreatorUserByName('testing')).toBe(user);
    expect(await rr.getDirectByUsernames([user.username])).toBeDefined();
    expect(await rr.getDirectByUsernames([user.username])).toBe(room);
});

test('useTheIterators', async () => {
        expect(() => new RoomRead(mockRoomBridgeWithRoom, 'testing-app')).not.toThrow();

        const rr = new RoomRead(mockRoomBridgeWithRoom, 'testing-app');
        await expect(() => rr.getMessages('faker')).toThrowError( 'Method not implemented.');

        expect(await rr.getMembers('testing')).toBeDefined();
        expect(await rr.getMembers('testing') as Array<IUser>).not.toBeEmpty();
        expect((await rr.getMembers('testing'))[0]).toBe(user);
});
