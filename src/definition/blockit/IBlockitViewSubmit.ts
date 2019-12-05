import { IRoom } from '../rooms';
import { IUser } from '../users';
import { IBlockitView } from './IBlockitView';

export interface IBlockitViewSubmit {
    appId: string;
    actionId: string;
    view: IBlockitView;
    user: IUser;
    room?: IRoom;
    triggerId?: string;
}
