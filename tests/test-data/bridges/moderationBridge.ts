import { IMessage } from '../../../src/definition/messages';
import { IUser } from '../../../src/definition/users';
import { ModerationBridge } from '../../../src/server/bridges';

export class TestsModerationBridge extends ModerationBridge {
    public report(messageId: string, description: string, userId: string, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public deleteMessage(message: IMessage, user: IUser, reason: string, action: string, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public deactivateUser(userId: IUser['id'], confirmRelinquish: boolean, reason: string, action: string, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public resetUserAvatar(userId: string, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
