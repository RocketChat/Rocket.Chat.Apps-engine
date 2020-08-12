import { AccessoryElements, IBlockElement, IImageElement, IInputElement } from './Elements';
import { ITextObject } from './Objects';

export enum BlockType {
    SECTION = 'section',
    DIVIDER = 'divider',
    IMAGE = 'image',
    ACTIONS = 'actions',
    CONTEXT = 'context',
    INPUT = 'input',
    CONDITIONAL = 'conditional',
}

export interface IBlock {
    type: BlockType;
    appId?: string;
    blockId?: string;
}

export interface ISectionBlock extends IBlock {
    type: BlockType.SECTION;
    text: ITextObject;
    accessory?: AccessoryElements;
}

export interface IImageBlock extends IBlock {
    type: BlockType.IMAGE;
    imageUrl: string;
    altText: string;
    title?: ITextObject;
}

export interface IDividerBlock extends IBlock {
    type: BlockType.DIVIDER;
}

export interface IActionsBlock extends IBlock {
    type: BlockType.ACTIONS;
    elements: Array<IBlockElement>;
}

export interface IContextBlock extends IBlock {
    type: BlockType.CONTEXT;
    elements: Array<ITextObject | IImageElement>;
}

export interface IInputBlock extends IBlock {
    type: BlockType.INPUT;
    element: IInputElement;
    label: ITextObject;
    optional?: boolean;
}

export interface IConditionalBlockFilters {
    engine?: Array<'rocket.chat' | 'livechat'>;
}

/**
 * Declares a block that is only visible when a certain
 * condition is met.
 *
 * The content specified in the `render` property will be
 * shown.
 *
 * No condition will be checked by default, i.e. the block
 * will be shown in every case like other blocks.
 *
 * Currently supported conditions:
 *      `engine: Array<"rocket.chat" | "livechat">` specifies what engine should
 *      render the block:
 *          "rocket.chat" for regular Rocket.Chat engine
 *          "livechat" for the Livechat/Omnichannel widget engine
 *      leave it blank to show the block in both engines
 */
export interface IConditionalBlock extends IBlock {
    type: BlockType.CONDITIONAL;
    when?: IConditionalBlockFilters;
    render: Array<IBlock>;
}
