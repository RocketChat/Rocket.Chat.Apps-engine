import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';
import { BaseBridge } from './BaseBridge';

export abstract class EmailBridge extends BaseBridge {
    public async doSendOtpCodeThroughSMTP(email: string, code: string, language: string, appId: string): Promise<void> {
        if (this.hasWritePermission(appId)) {
            return this.sendOtpCodeThroughSMTP(email, code, language, appId);
        }
    }

    protected abstract sendOtpCodeThroughSMTP(email: string, code: string, language: string, appId: string): Promise<void>;

    private hasWritePermission(appId: string): boolean {
        if (AppPermissionManager.hasPermission(appId, AppPermissions.email.sendOTP)) {
            return true;
        }

        AppPermissionManager.notifyAboutError(
            new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.email.sendOTP],
            }),
        );

        return false;
    }
}
