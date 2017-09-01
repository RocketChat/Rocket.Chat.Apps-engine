import { IModify, IModifyCreator, IModifyExtender, IModifyUpdater } from 'temporary-rocketlets-ts-definition/accessors';

import { RocketletBridges } from '../bridges';
import { ModifyCreator } from './ModifyCreator';
import { ModifyUpdater } from './ModifyUpdater';

export class Modify implements IModify {
    private creator: IModifyCreator;
    private updater: IModifyUpdater;

    constructor(private readonly bridges: RocketletBridges, private readonly rocketletId: string) {
        this.creator = new ModifyCreator(this.bridges, this.rocketletId);
        this.updater = new ModifyUpdater(this.bridges, this.rocketletId);
    }

    public getCreator(): IModifyCreator {
        return this.creator;
    }

    public getUpdater(): IModifyUpdater {
        return this.updater;
    }

    public getExtender(): IModifyExtender {
        throw new Error('Method not implemented.');
    }
}
