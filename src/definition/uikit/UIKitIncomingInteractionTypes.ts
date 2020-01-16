import { IMessage } from '../messages';
import { IRoom } from '../rooms';
import { IUser } from '../users';
import { IUIKitView } from './IUIKitView';

export interface IUIKitBaseIncomingInteraction {
    appId: string;
    actionId: string;
    user: IUser;
    room?: IRoom;
    triggerId?: string;
}

export interface IUIKitBlockIncomingInteraction extends IUIKitBaseIncomingInteraction {
    value?: string;
    message?: IMessage;
    triggerId: IUIKitBaseIncomingInteraction['triggerId'];
    room: IUIKitBaseIncomingInteraction['room'];
}

export interface IUIKitViewSubmitIncomingInteraction extends IUIKitBaseIncomingInteraction {
    view: IUIKitView;
}

export interface IUIKitViewCloseIncomingInteraction extends IUIKitBaseIncomingInteraction {
    view: IUIKitView;
    isCleared: boolean;
}
