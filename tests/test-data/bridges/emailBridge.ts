import { EmailBridge } from '../../../src/server/bridges/EmailBridge';

export class TestsEmailBridge extends EmailBridge {
    protected sendOtpCodeThroughSMTP(email: string, code: string, language: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
