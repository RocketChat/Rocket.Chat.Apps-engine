import { IRoom } from '../../../src/definition/rooms';
import { ISetting } from '../../../src/definition/settings';
import { AppManager } from '../../../src/server/AppManager';
import { AppBridges, IInternalBridge } from '../../../src/server/bridges';
import { Room } from '../../../src/server/rooms/Room';

const mockUsernames: Array<string> = [
    'Bradley Hilton',
    'Rodrigo Nascimento',
    'Shiqi Mei',
    'Douglas Gubert',
];
const mockRoomId = 'testing-roomId';
let mockAppManager: AppManager;
let mockInternalBridge: IInternalBridge;

beforeAll(() => {
    mockInternalBridge = {

        getUsernamesOfRoomById: (roomId: string) => [],
        getWorkspacePublicKey: () => Promise.resolve({} as ISetting),
    } as IInternalBridge;

    mockAppManager = {
        getBridges(): AppBridges {
            return {
                getInternalBridge: () => mockInternalBridge,
            } as AppBridges;
        },
    } as AppManager;
});

test('check methods of the class Room', () => {
    const expectedValue: any = {
        createdAt: undefined,
        creator: undefined,
        customFields: undefined,
        displayName: undefined,
        displaySystemMessages: undefined,
        id: undefined,
        isDefault: undefined,
        isReadOnly: undefined,
        lastModifiedAt: undefined,
        messageCount: undefined,
        slugifiedName: undefined,
        type: undefined,
        updatedAt: undefined,
    };
    let room: Room;

    expect(() => room = new Room({} as IRoom, mockAppManager)).not.toThrow();
    expect(room.valueOf()).toStrictEqual(expectedValue);
    expect(room.toString()).toStrictEqual(expectedValue); // currently, this method is equivalent to valueOf
});

test(`check usernames' getter and setter`, () => {
    const room = new Room({ id: mockRoomId } as IRoom, mockAppManager);
    const getUsernamesOfRoomByIdSpy = jest.spyOn(mockInternalBridge, 'getUsernamesOfRoomById');

    expect(room.usernames).toBeEmpty();
    room.usernames = mockUsernames;
    expect(getUsernamesOfRoomByIdSpy).toHaveBeenCalledWith(mockRoomId);
    expect(getUsernamesOfRoomByIdSpy).toHaveBeenCalledTimes(1);

    expect(room.usernames).toEqual([]); // currently, this setter does nothing
});
