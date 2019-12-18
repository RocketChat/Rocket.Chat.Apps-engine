import { IRoom } from '../rooms';
import { IUser } from '../users';
import { IUIKitView } from './IUIKitView';

export interface IUIKitViewSubmit {
    appId: string;
    actionId: string;
    view: IUIKitView;
    user: IUser;
    room?: IRoom;
    triggerId?: string;
}
