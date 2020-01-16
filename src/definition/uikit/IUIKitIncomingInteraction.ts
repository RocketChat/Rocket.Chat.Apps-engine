import { IMessage } from '../messages';
import { IRoom } from '../rooms';
import { IUser } from '../users';

export enum UIKitIncomingInteractionType {
    BLOCK = 'blockAction',
    VIEW_SUBMIT = 'viewSubmit',
    VIEW_CLOSED = 'viewClosed',
}

export interface IUIKitIncomingInteraction {
    type: UIKitIncomingInteractionType;
    user: IUser;
    appId: string;
    actionId: string;
    payload: object;
    triggerId?: string;
    room?: IRoom;
    message?: IMessage;
}
