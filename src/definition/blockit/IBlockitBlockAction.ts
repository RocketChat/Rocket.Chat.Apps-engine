import { IMessage } from '../messages';
import { IUser } from '../users';

export interface IBlockitBlockAction {
    appId: string;
    actionId: string;
    value?: string;
    message?: IMessage;
    user: IUser;
    triggerId: string;
}
