import { IRoom, RoomType } from '@rocket.chat/apps-ts-definition/rooms';
import { Expect, Test } from 'alsatian';
import { TestData } from '../../test-data/utilities';

import { RoomBuilder } from '../../../src/server/accessors';

export class RoomBuilderAccessorTestFixture {
    @Test()
    public basicRoomBuilder() {
        Expect(() => new RoomBuilder()).not.toThrow();
        Expect(() => new RoomBuilder(TestData.getRoom())).not.toThrow();
    }

    @Test()
    public settingOnRoomBuilder() {
        const rbOnce = new RoomBuilder();

        // setData just replaces the passed in object, so let's treat it differently
        Expect(rbOnce.setData({ displayName: 'Testing Channel' } as IRoom)).toBe(rbOnce);
        Expect((rbOnce as any).room.displayName).toBe('Testing Channel');

        const room: IRoom = {} as IRoom;
        const rb = new RoomBuilder(room);
        Expect(rb.setDisplayName('Just a Test')).toBe(rb);
        Expect(room.displayName).toEqual('Just a Test');

        Expect(rb.setSlugifiedName('just_a_test')).toBe(rb);
        Expect(room.slugifiedName).toEqual('just_a_test');

        Expect(rb.setType(RoomType.CHANNEL)).toBe(rb);
        Expect(room.type).toEqual(RoomType.CHANNEL);

        Expect(rb.setCreator(TestData.getUser())).toBe(rb);
        Expect(room.creator).toEqual(TestData.getUser());

        Expect(rb.addUsername('testing.username')).toBe(rb);
        Expect(room.usernames).not.toBeEmpty();
        Expect(room.usernames[0]).toEqual('testing.username');
        Expect(rb.addUsername('another.username')).toBe(rb);
        Expect(room.usernames.length).toBe(2);

        Expect(rb.setUsernames([])).toBe(rb);
        Expect(room.usernames).toBeEmpty();

        Expect(rb.setDefault(true)).toBe(rb);
        Expect(room.isDefault).toBeTruthy();

        Expect(rb.setReadOnly(false)).toBe(rb);
        Expect(room.isReadOnly).not.toBeTruthy();

        Expect(rb.setDisplayingOfSystemMessages(true)).toBe(rb);
        Expect(room.displaySystemMessages).toBeTruthy();

        Expect(rb.addCustomField('thing', {})).toBe(rb);
        Expect(room.customFields).not.toBeEmpty();
        Expect(room.customFields.thing).toBeEmpty();
        Expect(rb.addCustomField('another', { thingy: 'two' })).toBe(rb);
        Expect(room.customFields.another).toEqual({ thingy: 'two' });

        Expect(rb.setCustomFields({})).toBe(rb);
        Expect(room.customFields).toBeEmpty();

        Expect(rb.getRoom()).toBe(room);
    }
}
