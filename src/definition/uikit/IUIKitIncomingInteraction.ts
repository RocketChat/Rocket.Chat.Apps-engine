import { IMessage } from '../messages';
import { IRoom } from '../rooms';
import { IUser } from '../users';
import {
    IUIKitIncomingInteractionMessageContainer,
    IUIKitIncomingInteractionModalContainer,
    IUIKitIncomingInteractionSlashCommandContainer,
} from './UIKitIncomingInteractionContainer';

export enum UIKitIncomingInteractionType {
    BLOCK = 'blockAction',
    VIEW_SUBMIT = 'viewSubmit',
    VIEW_CLOSED = 'viewClosed',
}

export interface IUIKitIncomingInteraction {
    type: UIKitIncomingInteractionType;
    container: IUIKitIncomingInteractionModalContainer | IUIKitIncomingInteractionSlashCommandContainer | IUIKitIncomingInteractionMessageContainer;
    user: IUser;
    appId: string;
    actionId: string;
    payload: object;
    triggerId?: string;
    room?: IRoom;
    message?: IMessage;
}
