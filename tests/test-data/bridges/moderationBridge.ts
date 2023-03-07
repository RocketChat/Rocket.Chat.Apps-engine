import { ModerationBridge } from '../../../src/server/bridges';

export class TestsModerationBridge extends ModerationBridge {
    public report(messageId: string, description: string, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
