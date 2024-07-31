import type { AppBridges } from '../bridges';
import type { ISMTPOTPCreator } from '../../definition/accessors/ISMTPOTPCreator';

export class SMTPOTPCreator implements ISMTPOTPCreator {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) {}

    public async sendOTPThroughSMTP(email: string): Promise<any> {
        return this.bridges.getSMTPOTPBridge().doSendOtpCodeThroughSMTP(email, this.appId);
    }
}
