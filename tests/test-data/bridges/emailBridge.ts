import { EmailBridge } from '../../../src/server/bridges/EmailBridge';

export class TestsEmailBridge extends EmailBridge {
    protected verifyOTPCode(code: string, channel: string, email: string, appId: string): Promise<any> {
        throw new Error('Method not implemented.');
    }

    protected sendOtpCodeThroughSMTP(email: string, channel: string, appId: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
}
