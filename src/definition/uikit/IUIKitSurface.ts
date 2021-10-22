import { IBlock, IButtonElement, ITextObject } from './blocks';

export enum UIKitSurfaceType {
    MODAL = 'modal',
    HOME = 'home',
    CONTEXTUAL_BAR = 'contextual_bar',
}

export interface IUIKitSurface {
    appId: string;
    id: string;
    type: UIKitSurfaceType;
    title: ITextObject;
    blocks: Array<IBlock>;
    close?: IButtonElement;
    submit?: IButtonElement;
    state?: object;
    clearOnClose?: boolean;
    notifyOnClose?: boolean;
}

// Added for backwards compatibility
export type IUIKitView = IUIKitSurface;
export import UIKitViewType = UIKitSurfaceType;
