import { IRoom, RoomType } from '../../../src/definition/rooms';
import { TestData } from '../../test-data/utilities';

import { RoomBuilder } from '../../../src/server/accessors';

test('basicRoomBuilder', () => {
    expect(() => new RoomBuilder()).not.toThrow();
    expect(() => new RoomBuilder(TestData.getRoom())).not.toThrow();
});

test('settingOnRoomBuilder', () => {
    const rbOnce = new RoomBuilder();

    // setData just replaces the passed in object, so let's treat it differently
    expect(rbOnce.setData({ displayName: 'Testing Channel' } as IRoom)).toBe(rbOnce);
    expect((rbOnce as any).room.displayName).toBe('Testing Channel');

    const room: IRoom = {} as IRoom;
    const rb = new RoomBuilder(room);
    expect(rb.setDisplayName('Just a Test')).toBe(rb);
    expect(room.displayName).toEqual('Just a Test');
    expect(rb.getDisplayName()).toEqual('Just a Test');

    expect(rb.setSlugifiedName('just_a_test')).toBe(rb);
    expect(room.slugifiedName).toEqual('just_a_test');
    expect(rb.getSlugifiedName()).toEqual('just_a_test');

    expect(rb.setType(RoomType.CHANNEL)).toBe(rb);
    expect(room.type).toEqual(RoomType.CHANNEL);
    expect(rb.getType()).toEqual(RoomType.CHANNEL);

    const user = TestData.getUser();
    expect(rb.setCreator(user)).toBe(rb);
    expect(room.creator).toEqual(user);
    expect(rb.getCreator()).toEqual(user);

    expect(rb.addUsername('testing.username')).toBe(rb);
    expect(room.usernames).not.toBeDefined();
    expect(rb.getUsernames()).not.toBeEmpty();
    expect(room.usernames).not.toBeDefined();
    expect(rb.getUsernames()[0]).toEqual('testing.username');
    expect(rb.addUsername('another.username')).toBe(rb);
    expect(room.usernames).not.toBeDefined();
    expect(rb.getUsernames().length).toBe(2);

    expect(rb.setUsernames([])).toBe(rb);
    expect(room.usernames).not.toBeDefined();
    expect(rb.getUsernames()).toBeEmpty();

    expect(rb.addMemberToBeAddedByUsername('testing.username')).toBe(rb);
    expect(rb.getMembersToBeAddedUsernames()).not.toBeEmpty();
    expect(rb.getMembersToBeAddedUsernames()[0]).toEqual('testing.username');
    expect(rb.addMemberToBeAddedByUsername('another.username')).toBe(rb);
    expect(rb.getMembersToBeAddedUsernames().length).toBe(2);

    expect(rb.setMembersToBeAddedByUsernames([])).toBe(rb);
    expect(rb.getMembersToBeAddedUsernames()).toBeEmpty();

    expect(rb.setDefault(true)).toBe(rb);
    expect(room.isDefault).toBeTruthy();
    expect(rb.getIsDefault()).toBeTruthy();

    expect(rb.setReadOnly(false)).toBe(rb);
    expect(room.isReadOnly).not.toBeTruthy();
    expect(rb.getIsReadOnly()).not.toBeTruthy();

    expect(rb.setDisplayingOfSystemMessages(true)).toBe(rb);
    expect(room.displaySystemMessages).toBeTruthy();
    expect(rb.getDisplayingOfSystemMessages()).toBeTruthy();

    expect(rb.addCustomField('thing', {})).toBe(rb);
    expect(room.customFields).not.toBeEmpty();
    expect(rb.getCustomFields()).not.toBeEmpty();
    expect(room.customFields.thing).toBeDefined();
    expect(rb.getCustomFields().thing).toBeEmpty();
    expect(rb.addCustomField('another', { thingy: 'two' })).toBe(rb);
    expect(room.customFields.another).toEqual({ thingy: 'two' });
    expect(rb.getCustomFields().another).toEqual({ thingy: 'two' });

    expect(rb.setCustomFields({})).toBe(rb);
    expect(room.customFields).toBeEmpty();
    expect(rb.getCustomFields()).toBeEmpty();

    expect(rb.getRoom()).toBe(room);
});
