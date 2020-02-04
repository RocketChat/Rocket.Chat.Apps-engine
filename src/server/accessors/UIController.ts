import { IUIController } from '../../definition/accessors';
import { IUIKitErrorInteractionParam, IUIKitInteractionParam } from '../../definition/accessors/IUIController';
import { UIKitInteractionType } from '../../definition/uikit';
import { formatErrorInteraction, formatModalInteraction } from '../../definition/uikit/UIKitInteractionPayloadFormatter';
import { IUIKitModalViewParam } from '../../definition/uikit/UIKitInteractionResponder';
import { IUser } from '../../definition/users';
import { AppBridges, IUiInteractionBridge } from '../bridges';

export class UIController implements IUIController {
    private readonly uiInteractionBridge: IUiInteractionBridge;
    constructor(
        private readonly appId: string,
        bridges: AppBridges,
    ) {
        this.uiInteractionBridge = bridges.getUiInteractionBridge();
    }

    public openModalView(view: IUIKitModalViewParam, context: IUIKitInteractionParam, user: IUser) {
        const interactionContext = {
            ...context,
            type: UIKitInteractionType.MODAL_OPEN,
            appId: this.appId,
        };

        return this.uiInteractionBridge.notifyUser(user, formatModalInteraction(view, interactionContext), this.appId);
    }

    public updateModalView(view: IUIKitModalViewParam, context: IUIKitInteractionParam, user: IUser) {
        const interactionContext = {
            ...context,
            type: UIKitInteractionType.MODAL_UPDATE,
            appId: this.appId,
        };

        return this.uiInteractionBridge.notifyUser(user, formatModalInteraction(view, interactionContext), this.appId);
    }

    public setViewError(errorInteraction: IUIKitErrorInteractionParam, context: IUIKitInteractionParam, user: IUser) {
        const interactionContext = {
            ...context,
            type: UIKitInteractionType.ERRORS,
            appId: this.appId,
        };

        return this.uiInteractionBridge.notifyUser(user, formatErrorInteraction(errorInteraction, interactionContext), this.appId);
    }
}
