import { IMessage } from '@rocket.chat/apps-ts-definition/messages';
import { IRoom, RoomType } from '@rocket.chat/apps-ts-definition/rooms';
import { IUser, IUserEmail, UserStatusConnection, UserType } from '@rocket.chat/apps-ts-definition/users';
import { AppManager } from '../../src/server/AppManager';
import { AppInterface } from '../../src/server/compiler';

export class QuickMessageTests {
    private permUser: IUser;
    private permRoom: IRoom;

    constructor(private manager: AppManager) {
        const now = new Date();
        this.permUser = {
            id: 'quick-testing-user_1',
            username: 'quick-tester',
            emails: new Array<IUserEmail>(),
            type: UserType.USER,
            isEnabled: true,
            name: 'Testing User',
            roles: new Array<string>(),
            status: UserStatusConnection.ONLINE,
            statusConnection: UserStatusConnection.ONLINE,
            utcOffset: 0,
            createdAt: now,
            updatedAt: now,
            lastLoginAt: now,
        };

        this.permRoom = {
            id: 'quick-testing-room_1',
            slugifiedName: 'quick-testing-1',
            type: RoomType.CHANNEL,
            creator: this.permUser,
            usernames: new Array<string>(this.permUser.username),
            isDefault: true,
            messageCount: 0,
        };
    }

    public async testMessagePrevent() {
        const msg: IMessage = {
            room: this.permRoom,
            sender: this.permUser,
            text: 'testing-apps Prevent this',
        };

        const result = await this.manager.getListenerManager().executeListener(AppInterface.IPreMessageSentPrevent, msg);

        if (typeof result !== 'boolean') {
            throw new Error('Message Prevent test failure.');
        }
    }

    public async testMessageExtend() {
        const msg: IMessage = {
            room: this.permRoom,
            sender: this.permUser,
            text: 'testing-apps Extend this',
        };

        const result = await this.manager.getListenerManager().executeListener(AppInterface.IPreMessageSentExtend, msg);

        if (typeof result !== 'object') {
            throw new Error('Message Extend test failure.');
        }
    }
}
