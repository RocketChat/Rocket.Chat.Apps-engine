import { IMessage } from '../messages';
import { IRoom } from '../rooms';
import { IUser } from '../users';

export enum UIKitInteractionType {
    BLOCK = 'blockAction',
    VIEW_SUBMIT = 'viewSubmit',
    VIEW_CLOSED = 'viewClosed',
}

export interface IUIKitAction {
    type: UIKitInteractionType;
    user: IUser;
    appId: string;
    actionId: string;
    payload: object;
    triggerId?: string;
    room?: IRoom;
    message?: IMessage;
}
