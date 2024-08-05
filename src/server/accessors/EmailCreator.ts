import type { AppBridges } from '../bridges';
import type { IEmailCreator } from '../../definition/accessors/IEmailCreator';

export class EmailCreator implements IEmailCreator {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) {}

    public async sendOTPThroughSMTP(email: string, channel: string, visitorId: string): Promise<any> {
        return this.bridges.getEmailBridge().doSendOtpCodeThroughSMTP(email, channel, visitorId, this.appId);
    }
}
