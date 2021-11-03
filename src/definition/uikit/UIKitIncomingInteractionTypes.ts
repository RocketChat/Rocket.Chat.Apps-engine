import { IMessage } from '../messages';
import { IRoom } from '../rooms';
import { IUser } from '../users';
import { IUIKitSurface } from './IUIKitSurface';
import {
    IUIKitIncomingInteractionMessageContainer,
    IUIKitIncomingInteractionModalContainer,
    IUIKitIncomingInteractionContextualBarContainer,
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
    container: IUIKitIncomingInteractionModalContainer | IUIKitIncomingInteractionContextualBarContainer | IUIKitIncomingInteractionMessageContainer;
}

export interface IUIKitViewSubmitIncomingInteraction extends IUIKitBaseIncomingInteraction {
    view: IUIKitSurface;
    triggerId: string;
}

export interface IUIKitViewCloseIncomingInteraction extends IUIKitBaseIncomingInteraction {
    view: IUIKitSurface;
    isCleared: boolean;
}
