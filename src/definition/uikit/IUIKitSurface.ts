import { Block, ButtonElement, TextObject } from '@rocket.chat/ui-kit';
import { IBlock, IButtonElement, ITextObject } from './blocks';

export enum UIKitSurfaceType {
    MODAL = 'modal',
    HOME = 'home',
    CONTEXTUAL_BAR = 'contextualBar',
}

export interface IUIKitSurface {
    appId: string;
    id: string;
    type: UIKitSurfaceType;
    title: ITextObject | TextObject;
    blocks: Array<IBlock | Block>;
    close?: IButtonElement | ButtonElement;
    submit?: IButtonElement | ButtonElement;
    state?: object;
    clearOnClose?: boolean;
    notifyOnClose?: boolean;
}
