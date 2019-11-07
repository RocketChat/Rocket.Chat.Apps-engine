import { 
    IConfirmationObject,
    IPlainTextObject, 
    ITextObject,
} from './Objects';

export enum BlockElementType {
    BUTTON = 'button',
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
    text: IPlainTextObject;
    url?: string;
    style?: ButtonStyle;
    confirm?: IConfirmationObject;
}
