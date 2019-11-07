import { ITextObject, IPlainTextObject } from './Objects';
import { IBlockElement } from './Elements';

export enum BlockType {
    SECTION = 'selection',
    DIVIDER = 'divider',
    IMAGE = 'image',

}

export interface IBlock {
    type: BlockType;
    blockId?: string;
}

export interface ISectionBlock extends IBlock {
    type: BlockType.SECTION;
    text: ITextObject;
    accessory?: IBlockElement;
}

export interface IImageBlock extends IBlock {
    type: BlockType.IMAGE;
    imageUrl: string;
    altText: string;
    title?: IPlainTextObject;
    blockId?: string;
}

export interface IDividerBlock extends IBlock {
    type: BlockType.DIVIDER;
}
