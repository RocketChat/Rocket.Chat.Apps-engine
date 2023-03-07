import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';
import { BaseBridge } from './BaseBridge';

export abstract class ModerationBridge extends BaseBridge {
    public async doReport(messageId: string, description: string, appId: string): Promise<void> {
        if (this.hasWritePermission(appId)) {
            return this.report(messageId, description, appId);
        }
    }

    protected abstract report(messageId: string, description: string, appId: string): Promise<void>;

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

    // private hasReadPermission(appId: string): boolean {
    //     if (AppPermissionManager.hasPermission(appId, AppPermissions.moderation.read)) {
    //         return true;
    //     }

    //     AppPermissionManager.notifyAboutError(
    //         new PermissionDeniedError({
    //             appId,
    //             missingPermissions: [AppPermissions.moderation.read],
    //         }),
    //     );

    //     return false;
    // }
}
