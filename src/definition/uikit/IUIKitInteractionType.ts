import { IUIKitView } from './IUIKitView';

export enum UIKitInteractionType {
    MODAL_OPEN = 'modal.open',
    MODAL_CLOSE = 'modal.close',
    MODAL_UPDATE = 'modal.update',
    ERRORS = 'errors',
}

export interface IUIKitResponse {
    success: boolean;
}

export interface IUIKitInteraction {
    type: UIKitInteractionType;
    triggerId: string;
    appId: string;
}

export interface IUIKitErrorInteraction extends IUIKitInteraction {
    type: UIKitInteractionType.ERRORS;
    viewId: string;
    errors: { [field: string]: string };
}

export interface IUIKitModalInteraction extends IUIKitInteraction {
    type: UIKitInteractionType.MODAL_OPEN | UIKitInteractionType.MODAL_UPDATE | UIKitInteractionType.MODAL_CLOSE;
    view: IUIKitView;
}

export interface IUIKitModalResponse extends IUIKitModalInteraction, IUIKitResponse { }
export interface IUIKitErrorResponse extends IUIKitErrorInteraction, IUIKitResponse { }
