import type { AppBridges } from '../bridges';
import type { IEmailCreator } from '../../definition/accessors/IEmailCreator';
import type { IEmailDescriptor } from '../../definition/email';

export class EmailCreator implements IEmailCreator {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) {}

    public async send(email: IEmailDescriptor): Promise<void> {
        return this.bridges.getEmailBridge().doSendEmail(email, this.appId);
    }
}
