import { IConfirmationObject, ITextObject } from './Objects';

export enum BlockElementType {
    BUTTON = 'button',
    IMAGE = 'image',
}

export interface IBlockElement {
    type: BlockElementType;
}

export interface IInteractiveElement extends IBlockElement {
    actionId: string;
    value?: string;
}

export enum ButtonStyle {
    PRIMARY = 'primary',
    DANGER = 'danger',
}

export interface IButtonElement extends IInteractiveElement {
    type: BlockElementType.BUTTON;
    text: ITextObject;
    url?: string;
    style?: ButtonStyle;
    confirm?: IConfirmationObject;
}

export interface IImageElement extends IBlockElement {
    type: BlockElementType.IMAGE;
    imageUrl: string;
    altText: string;
}
