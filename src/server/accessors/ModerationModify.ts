import { IModerationModify } from '../../definition/accessors';
import { ModerationBridge } from '../bridges';

export class ModerationModify implements IModerationModify {
    constructor(private moderationBridge: ModerationBridge) {}

    public report(messageId: string, description: string, userId: string, appId: string): Promise<void> {
        return this.moderationBridge.doReport(messageId, description, userId, appId);
    }
}
