import * as uuid from 'uuid/v4';

import { Omit } from '../../../lib/utils';
import { BlockType, IActionsBlock, IBlock, IContextBlock, IImageBlock, ISectionBlock } from './Blocks';
import { BlockElementType, IBlockElement, IButtonElement, IImageElement, IInteractiveElement } from './Elements';

type BlockFunctionParameter<T extends IBlock> = Omit<T, 'type'>;
type ElementFunctionParameter<T extends IBlockElement> = T extends IInteractiveElement
    ? Omit<T, 'type' | 'actionId'> | Partial<Pick<T, 'actionId'>> : Omit<T, 'type'>;

type SectionBlockParam = BlockFunctionParameter<ISectionBlock>;
type ImageBlockParam = BlockFunctionParameter<IImageBlock>;
type ActionsBlockParam = BlockFunctionParameter<IActionsBlock>;
type ContextBlockParam = BlockFunctionParameter<IContextBlock>;

type ButtonElementParam = ElementFunctionParameter<IButtonElement>;
type ImageElementParam = ElementFunctionParameter<IImageElement>;

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

    private newInteractiveElement<T extends IInteractiveElement>(block: T): T {
        if (!block.actionId) {
            block.actionId = this.generateActionId();
        }

        return block;
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
