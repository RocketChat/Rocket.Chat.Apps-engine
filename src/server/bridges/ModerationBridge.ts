import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';
import { BaseBridge } from './BaseBridge';

export abstract class ModerationBridge extends BaseBridge {
    public async doReport(messageId: string, description: string, userId: string, appId: string): Promise<void> {
        if (this.hasWritePermission(appId)) {
            return this.report(messageId, description, userId, appId);
        }
    }

    protected abstract report(messageId: string, description: string, userId: string, appId: string): Promise<void>;

    private hasWritePermission(appId: string): boolean {
        if (AppPermissionManager.hasPermission(appId, AppPermissions.moderation.write)) {
            return true;
        }

        AppPermissionManager.notifyAboutError(
            new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.moderation.write],
            }),
        );

        return false;
    }
}
