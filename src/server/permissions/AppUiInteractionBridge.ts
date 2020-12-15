import { IPermission } from '../../definition/permission/IPermission';
import { IUIKitInteraction } from '../../definition/uikit';
import { IUser } from '../../definition/users';

export const UiInteractionPermissions: { [permission: string]: IPermission } = {
    // notifyUser
    interaction: {
        name: 'ui.interaction',
    },
};

export const AppUiInteractionBridge = {
    notifyUser(user: IUser, interaction: IUIKitInteraction, appId: string): void {
        return;
    },
};
