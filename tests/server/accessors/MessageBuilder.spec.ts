import { IMessage } from '../../../src/definition/messages';
import { TestData } from '../../test-data/utilities';

import { MessageBuilder } from '../../../src/server/accessors';

test('basicMessageBuilder', () => {
    expect(() => new MessageBuilder()).not.toThrow();
    expect(() => new MessageBuilder(TestData.getMessage())).not.toThrow();
});

test('settingOnMessageBuilder', () => {
    const mbOnce = new MessageBuilder();

    // setData just replaces the passed in object, so let's treat it differently
    expect(mbOnce.setData({text: 'hello' } as IMessage)).toBe(mbOnce);
    expect((mbOnce as any).msg.text).toBe('hello');

    const msg: IMessage = {} as IMessage;
    const mb = new MessageBuilder(msg);

    expect(mb.setThreadId('a random thread id')).toBe(mb);
    expect(msg.threadId).toBe('a random thread id');
    expect(mb.getThreadId()).toBe('a random thread id');

    const room = TestData.getRoom();
    expect(mb.setRoom(room)).toBe(mb);
    expect(msg.room).toEqual(room);
    expect(mb.getRoom()).toEqual(room);

    const user = TestData.getUser();
    expect(mb.setSender(user)).toBe(mb);
    expect(msg.sender).toEqual(user);
    expect(mb.getSender()).toEqual(user);

    expect(mb.setText('testing, yo!')).toBe(mb);
    expect(msg.text).toEqual('testing, yo!');
    expect(mb.getText()).toEqual('testing, yo!');

    expect(mb.setEmojiAvatar(':ghost:')).toBe(mb);
    expect(msg.emoji).toEqual(':ghost:');
    expect(mb.getEmojiAvatar()).toEqual(':ghost:');

    expect(mb.setAvatarUrl('https://rocket.chat/')).toBe(mb);
    expect(msg.avatarUrl).toEqual('https://rocket.chat/');
    expect(mb.getAvatarUrl()).toEqual('https://rocket.chat/');

    expect(mb.setUsernameAlias('Some Bot')).toBe(mb);
    expect(msg.alias).toEqual('Some Bot');
    expect(mb.getUsernameAlias()).toEqual('Some Bot');

    expect(msg.attachments).not.toBeDefined();
    expect(mb.getAttachments()).not.toBeDefined();
    expect(mb.addAttachment({ color: '#0ff' })).toBe(mb);
    expect(msg.attachments).toBeDefined();
    expect(mb.getAttachments()).toBeDefined();
    expect(msg.attachments).not.toBeEmpty();
    expect(mb.getAttachments()).not.toBeEmpty();

    expect(msg.attachments[0].color).toEqual('#0ff');
    expect(mb.getAttachments()[0].color).toEqual('#0ff');

    expect(mb.setAttachments([])).toBe(mb);
    expect(msg.attachments).toBeEmpty();
    expect(mb.getAttachments()).toBeEmpty();

    delete msg.attachments;
    expect(() => mb.replaceAttachment(1, {})).toThrowError('No attachment found at the index of "1" to replace.');
    expect(mb.addAttachment({})).toBe(mb);
    expect(mb.replaceAttachment(0, { color: '#f0f'})).toBe(mb);
    expect(msg.attachments[0].color).toEqual('#f0f');
    expect(mb.getAttachments()[0].color).toEqual('#f0f');

    expect(mb.removeAttachment(0)).toBe(mb);
    expect(msg.attachments).toBeEmpty();
    expect(mb.getAttachments()).toBeEmpty();

    delete msg.attachments;
    expect(() => mb.removeAttachment(4)).toThrowError('No attachment found at the index of "4" to remove.');

    expect(mb.setEditor(TestData.getUser('msg-editor-id'))).toBe(mb);
    expect(msg.editor).toBeDefined();
    expect(mb.getEditor()).toBeDefined();
    expect(msg.editor.id).toEqual('msg-editor-id');
    expect(mb.getEditor().id).toEqual('msg-editor-id');

    expect(mb.getMessage()).toBe(msg);
    delete msg.room;
    expect(() => mb.getMessage()).toThrowError('The "room" property is required.');

    expect(mb.setGroupable(true)).toBe(mb);
    expect(msg.groupable).toEqual(true);
    expect(mb.getGroupable()).toEqual(true);

    expect(mb.setGroupable(false)).toBe(mb);
    expect(msg.groupable).toEqual(false);
    expect(mb.getGroupable()).toEqual(false);

    expect(mb.setParseUrls(true)).toBe(mb);
    expect(msg.parseUrls).toEqual(true);
    expect(mb.getParseUrls()).toEqual(true);

    expect(mb.setParseUrls(false)).toBe(mb);
    expect(msg.parseUrls).toEqual(false);
    expect(mb.getParseUrls()).toEqual(false);
});
