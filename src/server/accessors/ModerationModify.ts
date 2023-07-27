import { IModerationModify } from '../../definition/accessors';
import { IMessage } from '../../definition/messages';
import { IUser } from '../../definition/users';
import { ModerationBridge } from '../bridges';

export class ModerationModify implements IModerationModify {
    constructor(private moderationBridge: ModerationBridge, appId: string) {}

    public report(messageId: string, description: string, userId: string, appId: string): Promise<void> {
        return this.moderationBridge.doReport(messageId, description, userId, appId);
    }

    public dismissReportsByMessageId(messageId: IMessage['id'], reason: string, action: string, appId: string): Promise<void> {
        return this.moderationBridge.doDismissReportsByMessageId(messageId, reason, action, appId);
    }

    public dismissReportsByUserId(userId: IUser['id'], reason: string, action: string, appId: string): Promise<void> {
        return this.moderationBridge.doDismissReportsByUserId(userId, reason, action, appId);
    }

    public addRepRoles(appId: string): Promise<void> {
        return this.moderationBridge.doAddRepRoles(appId);
    }

    public addRepRolePermissions(appId: string): Promise<void> {
        return this.moderationBridge.doAddRepRolePermissions(appId);
    }
}
