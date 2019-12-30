import { IUser } from '../users';
import { IUIKitView } from './IUIKitView';

export enum UIKitResponseType {
    MODAL = 'modal',
    HOME = 'home',
}

export interface IUIKitResponse {
    success: boolean;
    user?: IUser;
}

export interface IUIKitInteractionResponse extends IUIKitResponse {
    type: UIKitResponseType;
    triggerId: string;
}

export interface IUIKitViewResponse extends IUIKitInteractionResponse {
    view: IUIKitView;
}
