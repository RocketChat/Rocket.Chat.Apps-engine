import { IBlockitResponse } from '../../definition/blockit/IBlockitResponse';
import { IUser } from '../../definition/users/IUser';

export interface IUiInteractionBridge {
    notifyUser(user: IUser, interaction: IBlockitResponse, appId: string): Promise<void>;
}
