import { IMessage } from '../messages';
import { IRoom } from '../rooms';
import { IUser } from '../users';

export interface IBlockitAction {
    appId: string;
    actionId: string;
    type: string;
    payload: object;
    triggerId?: string;
    room?: IRoom;
    message?: IMessage;
    user: IUser;
}
