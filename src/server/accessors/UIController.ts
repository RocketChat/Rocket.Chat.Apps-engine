import { IUIController } from '../../definition/accessors';
import { IUIKitErrorInteractionParam, IUIKitInteractionParam } from '../../definition/accessors/IUIController';
import { IUIKitInteraction, UIKitInteractionType } from '../../definition/uikit';
import { formatContextualBarInteraction, formatErrorInteraction, formatModalInteraction } from '../../definition/uikit/UIKitInteractionPayloadFormatter';
import { IUIKitContextualBarViewParam, IUIKitModalViewParam } from '../../definition/uikit/UIKitInteractionResponder';
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

    public openContextualBar(view: IUIKitContextualBarViewParam, context: IUIKitInteractionParam, user: IUser): Promise<void> {
        const interactionContext: IUIKitInteraction = {
            ...context,
            appId: this.appId,
            type: UIKitInteractionType.CONTEXTUAL_BAR_OPEN,
        };

        return this.uiInteractionBridge.notifyUser(user, formatContextualBarInteraction(view, interactionContext), this.appId);
    }
}
