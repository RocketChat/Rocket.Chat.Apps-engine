import * as uuid from 'uuid/v1';
import { Omit } from '../../../lib/utils';
import { BlockType, IActionsBlock, IBlock, IContextBlock, IImageBlock, IInputBlock, ISectionBlock } from './Blocks';
import { BlockElementType, IBlockElement, IButtonElement, IImageElement, IInputElement, IInteractiveElement, IPlainTextInputElement } from './Elements';

type BlockFunctionParameter<T extends IBlock> = Omit<T, 'type'>;
type ElementFunctionParameter<T extends IBlockElement> = T extends IInteractiveElement
    ? Omit<T, 'type' | 'actionId'> | Partial<Pick<T, 'actionId'>> : Omit<T, 'type'>;

type SectionBlockParam = BlockFunctionParameter<ISectionBlock>;
type ImageBlockParam = BlockFunctionParameter<IImageBlock>;
type ActionsBlockParam = BlockFunctionParameter<IActionsBlock>;
type ContextBlockParam = BlockFunctionParameter<IContextBlock>;
type InputBlockParam = BlockFunctionParameter<IInputBlock>;

type ButtonElementParam = ElementFunctionParameter<IButtonElement>;
type ImageElementParam = ElementFunctionParameter<IImageElement>;
type PlainTextInputElementParam = ElementFunctionParameter<IPlainTextInputElement>;

export class BlockBuilder {
    private readonly blocks: Array<IBlock>;

    constructor(private readonly appId: string) {
        this.blocks = [];
    }

    public addSectionBlock(block: SectionBlockParam): BlockBuilder {
        this.addBlock({ type: BlockType.SECTION, ...block } as ISectionBlock);

        return this;
    }

    public addImageBlock(block: ImageBlockParam): BlockBuilder {
        this.addBlock({ type: BlockType.IMAGE, ...block } as IImageBlock);

        return this;
    }

    public addDividerBlock(): BlockBuilder {
        this.addBlock({ type: BlockType.DIVIDER });

        return this;
    }

    public addActionsBlock(block: ActionsBlockParam): BlockBuilder {
        this.addBlock({ type: BlockType.ACTIONS, ...block } as IActionsBlock);

        return this;
    }

    public addContextBlock(block: ContextBlockParam): BlockBuilder {
        this.addBlock({ type: BlockType.CONTEXT, ...block } as IContextBlock);

        return this;
    }

    public addInputBlock(block: InputBlockParam): BlockBuilder {
        this.addBlock({ type: BlockType.INPUT, ...block } as IInputBlock);

        return this;
    }

    public getBlocks() {
        return this.blocks;
    }

    public newButtonElement(info: ButtonElementParam): IButtonElement {
        return this.newInteractiveElement({
            type: BlockElementType.BUTTON,
            ...info,
        } as IButtonElement);
    }

    public newImageElement(info: ImageElementParam): IImageElement {
        return {
            type: BlockElementType.IMAGE,
            ...info,
       } as IImageElement;
    }

    public newPlainTextInputElement(info: PlainTextInputElementParam): IPlainTextInputElement {
        return this.newInputElement({
            type: BlockElementType.PLAIN_TEXT_INPUT,
            ...info,
        } as IPlainTextInputElement);
    }

    private newInteractiveElement<T extends IInteractiveElement>(element: T): T {
        if (!element.actionId) {
            element.actionId = this.generateActionId();
        }

        return element;
    }

    private newInputElement<T extends IInputElement>(element: T): T {
        if (!element.actionId) {
            element.actionId = this.generateActionId();
        }

        return element;
    }

    private addBlock(block: IBlock): void {
        if (!block.blockId) {
            block.blockId = this.generateBlockId();
        }

        block.appId = this.appId;

        this.blocks.push(block);
    }

    private generateBlockId(): string {
        return uuid();
    }

    private generateActionId(): string {
        return uuid();
    }
}
