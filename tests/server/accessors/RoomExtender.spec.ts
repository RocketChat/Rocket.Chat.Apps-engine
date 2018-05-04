import { IRoom } from '@rocket.chat/apps-ts-definition/rooms';
import { Expect, Test } from 'alsatian';
import { TestData } from '../../test-data/utilities';

import { RoomExtender } from '../../../src/server/accessors';

export class RoomExtenderAccessorTestFixture {
    @Test()
    public basicRoomExtender() {
        Expect(() => new RoomExtender({} as IRoom)).not.toThrow();
        Expect(() => new RoomExtender(TestData.getRoom())).not.toThrow();
    }

    @Test()
    public usingRoomExtender() {
        const room: IRoom = { } as IRoom;
        const re = new RoomExtender(room);

        Expect(room.customFields).not.toBeDefined();
        Expect(re.addCustomField('thing', 'value')).toBe(re);
        Expect(room.customFields).toBeDefined();
        Expect(room.customFields.thing as any).toBe('value');
        Expect(() => re.addCustomField('thing', 'second')).toThrowError(Error, 'The room already contains a custom field by the key: thing');

        Expect(room.usernames).not.toBeDefined();
        Expect(re.addMember(TestData.getUser('theId', 'bradley'))).toBe(re);
        Expect(room.usernames).toBeDefined();
        Expect(room.usernames).not.toBeEmpty();
        Expect(room.usernames[0]).toBe('bradley');
        Expect(() => re.addMember(TestData.getUser('theSameUsername', 'bradley'))).toThrowError(Error, 'The user is already in the room.');

        Expect(re.getRoom()).not.toBe(room);
        Expect(re.getRoom()).toEqual(room);
    }
}
