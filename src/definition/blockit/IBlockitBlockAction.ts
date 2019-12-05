import { IMessage } from '../messages';
import { IRoom } from '../rooms';
import { IUser } from '../users';

export interface IBlockitBlockAction {
    appId: string;
    actionId: string;
    value?: string;
    message?: IMessage;
    user: IUser;
    room: IRoom;
    triggerId: string;
}
