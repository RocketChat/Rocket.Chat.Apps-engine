import { IConfirmationObject, ITextObject } from './Objects';

export enum BlockElementType {
    BUTTON = 'button',
    IMAGE = 'image',
    PLAIN_TEXT_INPUT = 'plain_text_input',
    STATIC_SELECT = 'static_select',
    MULTI_STATIC_SELECT = 'multi_static_select',
}

export interface IBlockElement {
    type: BlockElementType;
}

export type AvailableElements = IButtonElement | IImageElement;

export interface IInteractiveElement extends IBlockElement {
    actionId: string;
    value?: string;
}

export interface IInputElement extends IBlockElement {
    actionId: string;
    placeholder: ITextObject;
    initialValue?: string | Array<string>;
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

export interface IPlainTextInputElement extends IInputElement {
    type: BlockElementType.PLAIN_TEXT_INPUT;
}

export interface ISelectElement extends IInputElement {
    type: BlockElementType.STATIC_SELECT | BlockElementType.MULTI_STATIC_SELECT;
    initialValue?: Array<string>;
}

export interface ISelectOption {
    text: ITextObject;
    value: string;
}

export interface IStaticSelectElement extends ISelectElement {
    type: BlockElementType.STATIC_SELECT;
    placeholder: ITextObject;
    options: Array<ISelectOption>;
}

export interface IMultiStaticSelectElement extends ISelectElement {
    type: BlockElementType.MULTI_STATIC_SELECT;
    placeholder: ITextObject;
    options: Array<ISelectOption>;
}
