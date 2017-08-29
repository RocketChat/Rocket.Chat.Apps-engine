import { IModify, IModifyCreator, IModifyExtender, IModifyUpdater } from 'temporary-rocketlets-ts-definition/accessors';

import { RocketletBridges } from '../bridges';
import { ModifyCreator } from './ModifyCreator';

export class Modify implements IModify {
    private creator: IModifyCreator;

    constructor(private readonly bridges: RocketletBridges, private readonly rocketletId: string) {
        this.creator = new ModifyCreator(this.bridges, this.rocketletId);
    }

    public getCreator(): IModifyCreator {
        return this.creator;
    }

    public getUpdater(): IModifyUpdater {
        throw new Error('Method not implemented.');
    }

    public getExtender(): IModifyExtender {
        throw new Error('Method not implemented.');
    }
}
