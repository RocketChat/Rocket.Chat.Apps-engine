import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';
import { BaseBridge } from './BaseBridge';

export abstract class EmailBridge extends BaseBridge {
    public async doSendOtpCodeThroughSMTP(email: string, appId: string): Promise<any> {
        if (this.hasWritePermission(appId)) {
            return this.sendOtpCodeThroughSMTP(email, appId);
        }
    }

    public async doVerifyOTPCode(code: string, email: string, appId: string): Promise<any> {
        if (this.hasReadPermission(appId)) {
            return this.verifyOTPCode(code, email, appId);
        }
    }

    protected abstract sendOtpCodeThroughSMTP(email: string, appId: string): Promise<any>;

    protected abstract verifyOTPCode(code: string, email: string, appId: string): Promise<any>;

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

    private hasReadPermission(appId: string): boolean {
        if (AppPermissionManager.hasPermission(appId, AppPermissions.email.verifyOTP)) {
            return true;
        }

        AppPermissionManager.notifyAboutError(
            new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.email.verifyOTP],
            }),
        );

        return false;
    }
}
