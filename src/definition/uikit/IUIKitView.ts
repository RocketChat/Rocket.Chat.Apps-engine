import { IBlock, IButtonElement, ITextObject } from './blocks';

export enum UIKitViewType {
    MODAL = 'modal',
    CONTEXTUAL_BAR = 'contextual_bar',
    // HOME = 'home',
}

export interface IUIKitView {
    appId: string;
    id: string;
    type: UIKitViewType;
    title: ITextObject;
    blocks: Array<IBlock>;
    close?: IButtonElement;
    submit?: IButtonElement;
    state?: object;
    clearOnClose?: boolean;
    notifyOnClose?: boolean;
}
