import { IUIKitInteraction } from '../../definition/uikit';
import { IUser } from '../../definition/users/IUser';

export interface IUiInteractionBridge {
    name: string;
    notifyUser(user: IUser, interaction: IUIKitInteraction, appId: string): Promise<void>;
}
