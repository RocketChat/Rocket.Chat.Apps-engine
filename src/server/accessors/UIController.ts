import { IUIController } from '../../definition/accessors';
import { IUIKitInteractionParam } from '../../definition/accessors/IUIController';
import { IUIKitInteraction, UIKitInteractionType } from '../../definition/uikit';
import { formatModalInteraction } from '../../definition/uikit/UIKitInteractionPayloadFormatter';
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

        console.log('openModalView', user);

        return this.uiInteractionBridge.notifyUser(user, formatModalInteraction(view, interactionContext), this.appId);
    }

    public updateModalView(view: IUIKitModalViewParam, context: IUIKitInteraction, user: IUser) {
        const interactionContext = {
            ...context,
            type: UIKitInteractionType.MODAL_UPDATE,
            appId: this.appId,
        };

        return this.uiInteractionBridge.notifyUser(user, formatModalInteraction(view, interactionContext), this.appId);
    }
}
