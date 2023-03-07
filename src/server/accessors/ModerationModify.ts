import { IModerationModify } from '../../definition/accessors';
import { ModerationBridge } from '../bridges';

export class ModerationModify implements IModerationModify {
    constructor(private moderationBridge: ModerationBridge, private appId: string) {}

    public report(messageId: string, description: string): Promise<void> {
        return this.moderationBridge.doReport(messageId, description, this.appId);
    }
}
