import * as uuid from 'uuid/v4';
import { BlockType, IActionBlock, IBlock, IImageBlock, ISectionBlock } from './Blocks';

export class BlockBuilder {
    private readonly blocks: Array<IBlock>;

    constructor(private readonly appId: string) {
        this.blocks = [];
    }

    public addSectionBlock(block: ISectionBlock): BlockBuilder {
        this.addBlock(block);

        return this;
    }

    public addImageBlock(block: IImageBlock): BlockBuilder {
        this.addBlock(block);

        return this;
    }

    public addDividerBlock(): BlockBuilder {
        this.addBlock({ type: BlockType.DIVIDER });

        return this;
    }

    public addActionsBlock(block: IActionBlock): BlockBuilder {
        this.addBlock(block);

        return this;
    }

    public getBlocks() {
        return this.blocks;
    }

    // public newButtonElement(info: Exclude<IButtonElement, 'type'>): IButtonElement {
    //     return {
    //         type: BlockElementType.BUTTON,
    //         ...info,
    //     };
    // }

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
}
