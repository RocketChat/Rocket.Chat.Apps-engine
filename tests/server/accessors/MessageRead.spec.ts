import { AsyncTest, Expect, SetupFixture } from 'alsatian';

import type { IMessage } from '../../../src/definition/messages';
import { MessageRead } from '../../../src/server/accessors';
import type { MessageBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

export class MessageReadAccessorTestFixture {
    private msg: IMessage;

    private unreadMsgs: IMessage[];

    private unreadRoomId: string;

    private unreadUserId: string;

    private mockMsgBridgeWithMsg: MessageBridge;

    private mockMsgBridgeNoMsg: MessageBridge;

    @SetupFixture
    public setupFixture() {
        this.msg = TestData.getMessage();
        this.unreadMsgs = ['507f1f77bcf86cd799439011', '507f191e810c19729de860ea'].map((id) => TestData.getMessage(id));
        this.unreadRoomId = this.unreadMsgs[0].room.id;
        this.unreadUserId = this.unreadMsgs[0].sender.id;

        const theMsg = this.msg;
        const theUnreadMsg = this.unreadMsgs;
        const { unreadRoomId } = this;
        const { unreadUserId } = this;
        this.mockMsgBridgeWithMsg = {
            doGetById(id, appId): Promise<IMessage> {
                return Promise.resolve(theMsg);
            },
            doGetUnreadByRoomAndUser(roomId, uid, appId, options): Promise<IMessage[]> {
                if (roomId === unreadRoomId && uid === unreadUserId) {
                    return Promise.resolve(theUnreadMsg);
                }
                return Promise.resolve([]);
            },
        } as MessageBridge;

        this.mockMsgBridgeNoMsg = {
            doGetById(id, appId): Promise<IMessage> {
                return Promise.resolve(undefined);
            },
            doGetUnreadByRoomAndUser(roomId, uid, appId, options): Promise<IMessage[]> {
                return Promise.resolve(undefined);
            },
        } as MessageBridge;
    }

    @AsyncTest()
    public async expectDataFromMessageRead() {
        Expect(() => new MessageRead(this.mockMsgBridgeWithMsg, 'testing-app')).not.toThrow();

        const mr = new MessageRead(this.mockMsgBridgeWithMsg, 'testing-app');

        Expect(await mr.getById('fake')).toBeDefined();
        Expect(await mr.getById('fake')).toEqual(this.msg);

        Expect(await mr.getSenderUser('fake')).toBeDefined();
        Expect(await mr.getSenderUser('fake')).toEqual(this.msg.sender);

        Expect(await mr.getRoom('fake')).toBeDefined();
        Expect(await mr.getRoom('fake')).toEqual(this.msg.room);

        Expect(await mr.getUnreadByRoomAndUser(this.unreadRoomId, this.unreadUserId)).toBeDefined();
        Expect(await mr.getUnreadByRoomAndUser(this.unreadRoomId, this.unreadUserId)).toEqual(this.unreadMsgs);

        Expect(await mr.getUnreadByRoomAndUser('fake', 'fake')).toBeDefined();
        Expect(await mr.getUnreadByRoomAndUser('fake', 'fake')).toEqual([]);
    }

    @AsyncTest()
    public async doNotExpectDataFromMessageRead() {
        Expect(() => new MessageRead(this.mockMsgBridgeNoMsg, 'testing')).not.toThrow();

        const nomr = new MessageRead(this.mockMsgBridgeNoMsg, 'testing');
        Expect(await nomr.getById('fake')).not.toBeDefined();
        Expect(await nomr.getSenderUser('fake')).not.toBeDefined();
        Expect(await nomr.getRoom('fake')).not.toBeDefined();
        Expect(await nomr.getUnreadByRoomAndUser('fake', 'fake')).not.toBeDefined();
    }
}
