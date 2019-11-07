import { IMessage } from '../../../src/definition/messages';

import { MessageRead } from '../../../src/server/accessors';
import { IMessageBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

let msg: IMessage;
let mockMsgBridgeWithMsg: IMessageBridge;
let mockMsgBridgeNoMsg: IMessageBridge;

beforeAll(() =>  {
    msg = TestData.getMessage();

    const theMsg = msg;
    mockMsgBridgeWithMsg = {
        getById(id, appId): Promise<IMessage> {
            return Promise.resolve(theMsg);
        },
    } as IMessageBridge;

    mockMsgBridgeNoMsg = {
        getById(id, appId): Promise<IMessage> {
            return Promise.resolve(undefined);
        },
    } as IMessageBridge;
});

test('expectDataFromMessageRead', async () => {
    expect(() => new MessageRead(mockMsgBridgeWithMsg, 'testing-app')).not.toThrow();

    const mr = new MessageRead(mockMsgBridgeWithMsg, 'testing-app');

    expect(await mr.getById('fake')).toBeDefined();
    expect(await mr.getById('fake')).toEqual(msg);

    expect(await mr.getSenderUser('fake')).toBeDefined();
    expect(await mr.getSenderUser('fake')).toEqual(msg.sender);

    expect(await mr.getRoom('fake')).toBeDefined();
    expect(await mr.getRoom('fake')).toEqual(msg.room);
});

test('doNotexpectDataFromMessageRead', async () => {
    expect(() => new MessageRead(mockMsgBridgeNoMsg, 'testing')).not.toThrow();

    const nomr = new MessageRead(mockMsgBridgeNoMsg, 'testing');
    expect(await nomr.getById('fake')).not.toBeDefined();
    expect(await nomr.getSenderUser('fake')).not.toBeDefined();
    expect(await nomr.getRoom('fake')).not.toBeDefined();
});
