import * as uuid from 'uuid/v4';
import { Omit } from '../../lib/utils';
import { BlockType, IActionsBlock, IBlock, IImageBlock, ISectionBlock } from './Blocks';
import { BlockElementType, IButtonElement, IImageElement, IInteractiveElement } from './Elements';

export class BlockBuilder {
    private readonly blocks: Array<IBlock>;

    constructor(private readonly appId: string) {
        this.blocks = [];
    }

    public addSectionBlock(block: Omit<ISectionBlock, 'type'>): BlockBuilder {
        this.addBlock({ type: BlockType.SECTION, ...block } as ISectionBlock);

        return this;
    }

    public addImageBlock(block: Omit<IImageBlock, 'type'>): BlockBuilder {
        this.addBlock({ type: BlockType.IMAGE, ...block } as IImageBlock);

        return this;
    }

    public addDividerBlock(): BlockBuilder {
        this.addBlock({ type: BlockType.DIVIDER });

        return this;
    }

    public addActionsBlock(block: Omit<IActionsBlock, 'type'>): BlockBuilder {
        this.addBlock({ type: BlockType.ACTIONS, ...block } as IActionsBlock);

        return this;
    }

    public getBlocks() {
        return this.blocks;
    }

    public newButtonElement(info: Omit<IButtonElement, 'type' | 'actionId'>): IButtonElement {
        return this.newInteractiveElement({
            type: BlockElementType.BUTTON,
            ...info,
        } as IButtonElement);
    }

    public newImageElement(info: Omit<IImageElement, 'type'>): IImageElement {
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
