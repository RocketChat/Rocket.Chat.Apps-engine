import { IMessage } from '../../definition/messages';
import { IUser } from '../../definition/users';
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

    public async doDeleteMessage(message: IMessage, user: IUser, reason: string, action: string, appId: string): Promise<void> {
        if (this.hasWritePermission(appId)) {
            return this.deleteMessage(message, user, reason, action, appId);
        }
    }

    public async doDeactivateUser(userId: IUser['id'], confirmRelinquish: boolean, reason: string, action: string, appId: string): Promise<void> {
        if (this.hasWritePermission(appId)) {
            return this.deactivateUser(userId, confirmRelinquish, reason, action, appId);
        }
    }

    public async doResetUserAvatar(userId: IUser['id'], appId: string): Promise<void> {
        if (this.hasWritePermission(appId)) {
            return this.resetUserAvatar(userId, appId);
        }
    }

    protected abstract report(messageId: string, description: string, userId: string, appId: string): Promise<void>;
    protected abstract deleteMessage(message: IMessage, user: IUser, reason: string, action: string, appId: string): Promise<void>;
    protected abstract deactivateUser(userId: IUser['id'], confirmRelinquish: boolean, reason: string, action: string, appId: string): Promise<void>;
    protected abstract resetUserAvatar(userId: IUser['id'], appId: string): Promise<void>;

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
