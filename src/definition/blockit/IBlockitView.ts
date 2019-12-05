import { IBlock, IButtonElement, ITextObject } from '../blocks';

export enum BlockitViewType {
    MODAL = 'modal',
    HOME = 'home',
}

export interface IBlockitView {
    appId: string;
    id: string;
    type?: BlockitViewType; // TODO remove optional
    title?: ITextObject; // TODO remove optional
    blocks?: Array<IBlock>; // TODO remove optional
    close?: IButtonElement; // TODO remove optional
    submit?: IButtonElement; // TODO remove optional
    state?: object;
    clearOnClose?: boolean; // TODO remove optional
    notifyOnClose?: boolean; // TODO remove optional
}
