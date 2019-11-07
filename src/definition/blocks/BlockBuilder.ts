import * as uuid from 'uuid/v4';
import { BlockType, IBlock, IImageBlock, ISectionBlock } from './Blocks';

export class BlockBuilder {
    private readonly blocks: Array<IBlock>;

    constructor() {
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

    public getBlocks() {
        return this.blocks;
    }

    private addBlock(block: IBlock): void {
        if (!block.blockId) {
            block.blockId = this.generateBlockId();
        }

        this.blocks.push(block);
    }

    private generateBlockId(): string {
        return uuid();
    }
}
