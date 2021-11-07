import { IUIActionButton, IUIActionButtonDescriptor } from '../../definition/ui';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissions } from '../permissions/AppPermissions';
import { AppPermissionManager } from './AppPermissionManager';

export class UIActionButtonManager {
    private registeredActionButtons = new Map<string, Map<string, IUIActionButtonDescriptor>>();

    public registerActionButton(appId: string, button: IUIActionButtonDescriptor) {
        if (!this.hasPermission(appId)) {
            return false;
        }

        if (!this.registeredActionButtons.has(appId)) {
            this.registeredActionButtons.set(appId, new Map());
        }

        this.registeredActionButtons.get(appId).set(button.actionId, button);

        return true;
    }

    public clearAppActionButtons(appId: string) {
        this.registeredActionButtons.set(appId, new Map());
    }

    public getAppActionButtons(appId: string) {
        return this.registeredActionButtons.get(appId);
    }

    public getAllActionButtons() {
        const buttonList: Array<IUIActionButton> = [];

        // Flatten map to a simple list of all buttons
        this.registeredActionButtons.forEach((appButtons, appId) => appButtons
             .forEach((button) => buttonList.push({
                 ...button,
                 appId,
             })),
        );

        return buttonList;
    }

    private hasPermission(appId: string) {
        if (AppPermissionManager.hasPermission(appId, AppPermissions.ui.registerButtons)) {
            return true;
        }

        AppPermissionManager.notifyAboutError(new PermissionDeniedError({
            appId,
            missingPermissions: [AppPermissions.ui.registerButtons],
        }));

        return false;
    }
}
