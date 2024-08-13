import type { IEmailDescriptor } from '../../../src/definition/email';
import { EmailBridge } from '../../../src/server/bridges/EmailBridge';

export class TestsEmailBridge extends EmailBridge {
    protected sendEmail(email: IEmailDescriptor, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
