import { IBlock, ITextObject } from '../blocks';

export enum BlockitResponseType {
    MODAL = 'modal',
    HOME = 'home',
}

export interface IBlockitResponse {
    success: boolean;
    triggerId?: string;
    type?: BlockitResponseType;
    title?: ITextObject;
    submit?: ITextObject;
    close?: ITextObject;
    blocks?: Array<IBlock>;
}
