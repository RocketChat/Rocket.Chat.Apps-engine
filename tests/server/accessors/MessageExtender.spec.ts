import { IMessage } from '../../../src/definition/messages';
import { TestData } from '../../test-data/utilities';

import { MessageExtender } from '../../../src/server/accessors';

test('basicMessageExtender', () => {
    expect(() => new MessageExtender({} as IMessage)).not.toThrow();
    expect(() => new MessageExtender(TestData.getMessage())).not.toThrow();
});

test('usingMessageExtender', () => {
    const msg: IMessage = {} as IMessage;
    const me = new MessageExtender(msg);

    expect(msg.attachments).toBeDefined();
    expect(msg.attachments).toBeEmpty();
    expect(me.addCustomField('thing', 'value')).toBe(me);
    expect(msg.customFields).toBeDefined();
    expect(msg.customFields.thing).toBe('value');
    expect(() => me.addCustomField('thing', 'second')).toThrowError('The message already contains a custom field by the key: thing');

    expect(me.addAttachment({})).toBe(me);
    expect(msg.attachments.length).toBe(1);
    expect(me.addAttachments([{ collapsed: true }, { color: '#f00' }])).toBe(me);
    expect(msg.attachments.length).toBe(3);

    expect(me.getMessage()).not.toBe(msg);
    expect(me.getMessage()).toEqual(msg);
});
