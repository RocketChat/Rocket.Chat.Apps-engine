import type { IEmailReader } from '../../definition/accessors/IEmailReader';
import type { AppBridges } from '../bridges';

export class EmailReader implements IEmailReader {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) {}

    public async verifyOTPCode(code: string, channel: string, email: string): Promise<any> {
        return this.bridges.getEmailBridge().doVerifyOTPCode(code, email, channel, this.appId);
    }
}
