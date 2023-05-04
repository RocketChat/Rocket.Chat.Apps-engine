import { IModerationModify } from '../../definition/accessors';
import { IMessage } from '../../definition/messages';
import { IUser } from '../../definition/users';
import { ModerationBridge } from '../bridges';

export class ModerationModify implements IModerationModify {
    constructor(private moderationBridge: ModerationBridge, appId: string) {}

    public report(messageId: string, description: string, userId: string, appId: string): Promise<void> {
        return this.moderationBridge.doReport(messageId, description, userId, appId);
    }

    public deleteMessage(message: IMessage, user: IUser, reason: string, action: string, appId: string): Promise<void> {
        return this.moderationBridge.doDeleteMessage(message, user, reason, action, appId);
    }

    public deactivateUser(userId: IUser['id'], confirmRelinquish: boolean, reason: string, action: string, appId: string): Promise<void> {
        return this.moderationBridge.doDeactivateUser(userId, confirmRelinquish, reason, action, appId);
    }

    public resetUserAvatar(userId: string, appId: string): Promise<void> {
        return this.moderationBridge.doResetUserAvatar(userId, appId);
    }
}
