import type { ISMTPOTPReader } from '../../definition/accessors/ISMTPOTPReader';
import type { AppBridges } from '../bridges';

export class SMTPOTPReader implements ISMTPOTPReader {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) {}

    public async verifyOTPCode(code: string): Promise<any> {
        return this.bridges.getSMTPOTPBridge().doVerifyOTPCode(code, this.appId);
    }
}
