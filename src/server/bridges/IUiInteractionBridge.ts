import { IUIKitInteraction } from '../../definition/uikit';
import { IUser } from '../../definition/users/IUser';

export interface IUiInteractionBridge {
    notifyUser(user: IUser, interaction: IUIKitInteraction, appId: string): Promise<void>;
    doNotifyUser(user: IUser, interaction: IUIKitInteraction, appId: string): Promise<void>;
}
