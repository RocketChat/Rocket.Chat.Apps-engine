import { IUIController } from '../../definition/accessors';
import { IUIKitViewResponse } from '../../definition/uikit';
import { AppBridges, IUiInteractionBridge } from '../bridges';

export class UIController implements IUIController {
    private readonly uiInteractionBridge: IUiInteractionBridge;
    constructor(
        private readonly appId: string,
        bridges: AppBridges,
    ) {
        this.uiInteractionBridge = bridges.getUiInteractionBridge();
    }

    public openModalView(data: IUIKitViewResponse) {
        return this.uiInteractionBridge.notifyUser(data.user, data, this.appId);
    }
}
