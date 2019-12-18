import { IUIKitResponse } from '../../definition/uikit';
import { IUser } from '../../definition/users/IUser';

export interface IUiInteractionBridge {
    notifyUser(user: IUser, interaction: IUIKitResponse, appId: string): Promise<void>;
}
