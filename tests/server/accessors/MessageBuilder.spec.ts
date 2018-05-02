import { IMessage } from '@rocket.chat/apps-ts-definition/messages';
import { Expect, Test } from 'alsatian';
import { TestData } from '../../test-data/utilities';

import { MessageBuilder } from '../../../src/server/accessors';

export class MessageBuilderAccessorTestFixture {
    @Test()
    public basicMessageBuilder() {
        Expect(() => new MessageBuilder()).not.toThrow();
        Expect(() => new MessageBuilder(TestData.getMessage())).not.toThrow();
    }

    @Test()
    public settingOnMessageBuilder() {
        const mbOnce = new MessageBuilder();

        // setData just replaces the passed in object, so let's treat it differently
        Expect(mbOnce.setData({text: 'hello' } as IMessage)).toBe(mbOnce);
        Expect((mbOnce as any).msg.text).toBe('hello');

        const msg: IMessage = {} as IMessage;
        const mb = new MessageBuilder(msg);
        Expect(mb.setRoom(TestData.getRoom())).toBe(mb);
        Expect(msg.room).toEqual(TestData.getRoom());

        Expect(mb.setSender(TestData.getUser())).toBe(mb);
        Expect(msg.sender).toEqual(TestData.getUser());

        Expect(mb.setText('testing, yo!')).toBe(mb);
        Expect(msg.text).toEqual('testing, yo!');

        Expect(mb.setEmojiAvatar(':ghost:')).toBe(mb);
        Expect(msg.emoji).toEqual(':ghost:');

        Expect(mb.setAvatarUrl('https://rocket.chat/')).toBe(mb);
        Expect(msg.avatarUrl).toEqual('https://rocket.chat/');

        Expect(mb.setUsernameAlias('Some Bot')).toBe(mb);
        Expect(msg.alias).toEqual('Some Bot');

        Expect(msg.attachments).not.toBeDefined();
        Expect(mb.addAttachment({ color: '#0ff' })).toBe(mb);
        Expect(msg.attachments).toBeDefined();
        Expect(msg.attachments).not.toBeEmpty();
        Expect(msg.attachments[0].color).toEqual('#0ff');

        Expect(mb.setAttachments([])).toBe(mb);
        Expect(msg.attachments).toBeEmpty();

        delete msg.attachments;
        Expect(() => mb.replaceAttachment(1, {})).toThrowError(Error, 'No attachment found at the index of "1" to replace.');
        Expect(mb.addAttachment({})).toBe(mb);
        Expect(mb.replaceAttachment(0, { color: '#f0f'})).toBe(mb);
        Expect(msg.attachments[0].color).toEqual('#f0f');

        Expect(mb.removeAttachment(0)).toBe(mb);
        Expect(msg.attachments).toBeEmpty();
        delete msg.attachments;
        Expect(() => mb.removeAttachment(4)).toThrowError(Error, 'No attachment found at the index of "4" to remove.');

        Expect(mb.setEditor(TestData.getUser('msg-editor-id'))).toBe(mb);
        Expect(msg.editor).toBeDefined();
        Expect(msg.editor.id).toEqual('msg-editor-id');

        Expect(mb.getMessage()).toBe(msg);
        delete msg.room;
        Expect(() => mb.getMessage()).toThrowError(Error, 'The "room" property is required.');
    }
}
