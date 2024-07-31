import { SMTPOTPBridge } from '../../../src/server/bridges/SMTPOTPBridge';

export class TestsSMTPOtpBridge extends SMTPOTPBridge {
    protected verifyOTPCode(code: string, appId: string): Promise<any> {
        throw new Error('Method not implemented.');
    }

    protected sendOtpCodeThroughSMTP(email: string, appId: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
}
