import { ITypingOptions } from '../../definition/accessors/INotifier';
import { IMessage } from '../../definition/messages';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';
import { BaseBridge } from './BaseBridge';

export interface ITypingDescriptor extends ITypingOptions {
    isTyping: boolean;
}

export abstract class ThreadBridge extends BaseBridge {
    public async doGetById(messageId: string, appId: string): Promise<Array<IMessage>> {
        if (this.hasReadPermission(appId)) {
            return this.getById(messageId, appId);
        }
    }

    protected abstract getById(messageId: string, appId: string): Promise<Array<IMessage>>;

    private hasReadPermission(appId: string): boolean {
        if (AppPermissionManager.hasPermission(appId, AppPermissions.message.read)) {
            return true;
        }

        AppPermissionManager.notifyAboutError(
            new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.message.read],
            }),
        );

        return false;
    }
}
