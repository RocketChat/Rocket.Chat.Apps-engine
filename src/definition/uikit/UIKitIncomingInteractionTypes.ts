import { IMessage } from '../messages';
import { IRoom } from '../rooms';
import { UIActionButtonContext } from '../ui';
import { IUser } from '../users';
import { IUIKitView } from './IUIKitView';
import {
    IUIKitIncomingInteractionMessageContainer,
    IUIKitIncomingInteractionModalContainer,
} from './UIKitIncomingInteractionContainer';

export interface IUIKitBaseIncomingInteraction {
    appId: string;
    user: IUser;
    actionId?: string;
    room?: IRoom;
    triggerId?: string;
}

export interface IUIKitBlockIncomingInteraction extends IUIKitBaseIncomingInteraction {
    value?: string;
    message?: IMessage;
    triggerId: string;
    actionId: string;
    blockId: string;
    room: IUIKitBaseIncomingInteraction['room'];
    container: IUIKitIncomingInteractionModalContainer | IUIKitIncomingInteractionMessageContainer;
}

export interface IUIKitViewSubmitIncomingInteraction extends IUIKitBaseIncomingInteraction {
    view: IUIKitView;
    triggerId: string;
}

export interface IUIKitViewCloseIncomingInteraction extends IUIKitBaseIncomingInteraction {
    view: IUIKitView;
    isCleared: boolean;
}

export interface IUIKitActionButtonIncomingInteraction extends IUIKitBaseIncomingInteraction {
    context: UIActionButtonContext;
    actionId: string;
    triggerId: string;
    room: IRoom;
    message?: IMessage;
}
