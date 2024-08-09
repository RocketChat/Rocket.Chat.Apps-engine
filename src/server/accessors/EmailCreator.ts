import type { AppBridges } from '../bridges';
import type { IEmailCreator } from '../../definition/accessors/IEmailCreator';

export class EmailCreator implements IEmailCreator {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) {}

    public async sendOTPThroughSMTP(email: string, code: string, language: string): Promise<void> {
        return this.bridges.getEmailBridge().doSendOtpCodeThroughSMTP(email, code, language, this.appId);
    }
}
