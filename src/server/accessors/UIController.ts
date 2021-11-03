import { IUIController } from '../../definition/accessors';
import { IUIKitErrorInteractionParam, IUIKitInteractionParam } from '../../definition/accessors/IUIController';
import { UIKitInteractionType } from '../../definition/uikit';
import { formatContextualBarInteraction, formatErrorInteraction, formatModalInteraction } from '../../definition/uikit/UIKitInteractionPayloadFormatter';
import { IUIKitContextualBarViewParam, IUIKitModalViewParam } from '../../definition/uikit/UIKitInteractionResponder';
import { IUser } from '../../definition/users';
import { AppBridges, UiInteractionBridge } from '../bridges';

export class UIController implements IUIController {
    private readonly uiInteractionBridge: UiInteractionBridge;
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

        return this.uiInteractionBridge.doNotifyUser(user, formatModalInteraction(view, interactionContext), this.appId);
    }

    public updateModalView(view: IUIKitModalViewParam, context: IUIKitInteractionParam, user: IUser) {
        const interactionContext = {
            ...context,
            type: UIKitInteractionType.MODAL_UPDATE,
            appId: this.appId,
        };

        return this.uiInteractionBridge.doNotifyUser(user, formatModalInteraction(view, interactionContext), this.appId);
    }

    public openContextualBarView(view: IUIKitContextualBarViewParam, context: IUIKitInteractionParam, user: IUser) {
        const interactionContext = {
            ...context,
            type: UIKitInteractionType.CONTEXTUAL_BAR_OPEN,
            appId: this.appId,
        };

        return this.uiInteractionBridge.doNotifyUser(user, formatContextualBarInteraction(view, interactionContext), this.appId);
    }

    public updateContextualBarView(view: IUIKitContextualBarViewParam, context: IUIKitInteractionParam, user: IUser) {
        const interactionContext = {
            ...context,
            type: UIKitInteractionType.CONTEXTUAL_BAR_UPDATE,
            appId: this.appId,
        };

        return this.uiInteractionBridge.doNotifyUser(user, formatContextualBarInteraction(view, interactionContext), this.appId);
    }

    public setViewError(errorInteraction: IUIKitErrorInteractionParam, context: IUIKitInteractionParam, user: IUser) {
        const interactionContext = {
            ...context,
            type: UIKitInteractionType.ERRORS,
            appId: this.appId,
        };

        return this.uiInteractionBridge.doNotifyUser(user, formatErrorInteraction(errorInteraction, interactionContext), this.appId);
    }
}
