import { IMessage } from '../messages';
import { IUser } from '../users';

export interface IBlockitAction {
    appId: string;
    actionId: string;
    type: string;
    payload: object;
    triggerId?: string;
    message?: IMessage;
    user: IUser;
}
