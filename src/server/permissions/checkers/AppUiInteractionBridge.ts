import { IUIKitInteraction } from '../../../definition/uikit';
import { IUser } from '../../../definition/users';
import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppUiInteractionBridge = {
    hasInteractionPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.ui.interaction)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.ui.interaction],
            });
        }
    },
    notifyUser(user: IUser, interaction: IUIKitInteraction, appId: string): void {
        return this.hasInteractionPermission(appId);
    },
};
