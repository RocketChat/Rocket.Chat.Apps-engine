import { IUIKitView } from './IUIKitView';

export enum UIKitInteractionType {
    MODAL_OPEN = 'modal.open',
    MODAL_CLOSE = 'modal.close',
    MODAL_UPDATE = 'modal.update',
}

export interface IUIKitResponse {
    success: boolean;
}

export interface IUIKitInteraction {
    type: UIKitInteractionType;
    triggerId: string;
    appId: string;
}

export interface IUIKitModalInteraction extends IUIKitInteraction {
    type: UIKitInteractionType.MODAL_OPEN | UIKitInteractionType.MODAL_UPDATE | UIKitInteractionType.MODAL_CLOSE;
    view: IUIKitView;
}

export interface IUIKitModalResponse extends IUIKitModalInteraction, IUIKitResponse { }
