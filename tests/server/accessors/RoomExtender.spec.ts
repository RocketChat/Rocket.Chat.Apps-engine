import { IRoom } from '../../../src/definition/rooms';
import { TestData } from '../../test-data/utilities';

import { RoomExtender } from '../../../src/server/accessors';

test('basicRoomExtender', () => {
    expect(() => new RoomExtender({} as IRoom)).not.toThrow();
    expect(() => new RoomExtender(TestData.getRoom())).not.toThrow();
});

test('usingRoomExtender', () => {
    const room: IRoom = { } as IRoom;
    const re = new RoomExtender(room);

    expect(room.customFields).not.toBeDefined();
    expect(re.addCustomField('thing', 'value')).toBe(re);
    expect(room.customFields).toBeDefined();
    expect(room.customFields.thing as any).toBe('value');
    expect(() => re.addCustomField('thing', 'second')).toThrowError('The room already contains a custom field by the key: thing');

    expect(room.usernames).not.toBeDefined();
    expect(re.addMember(TestData.getUser('theId', 'bradley'))).toBe(re);
    expect(room.usernames).not.toBeDefined();
    expect(re.getMembersBeingAdded()).toBeDefined();
    expect(re.getMembersBeingAdded()).not.toBeEmpty();
    expect(re.getMembersBeingAdded()[0]).not.toBeEmpty();
    expect(re.getMembersBeingAdded()[0].username).toBe('bradley');
    expect(() => re.addMember(TestData.getUser('theSameUsername', 'bradley'))).toThrowError('The user is already in the room.');

    expect(re.getRoom()).not.toBe(room);
    expect(re.getRoom()).toEqual(room);
});
