import { IModify, IModifyCreator, IModifyExtender, IModifyUpdater } from 'temporary-rocketlets-ts-definition/accessors';

import { RocketletBridges } from '../bridges';
import { ModifyCreator } from './ModifyCreator';
import { ModifyExtender } from './ModifyExtender';
import { ModifyUpdater } from './ModifyUpdater';

export class Modify implements IModify {
    private creator: IModifyCreator;
    private updater: IModifyUpdater;
    private extender: IModifyExtender;

    constructor(private readonly bridges: RocketletBridges, private readonly rocketletId: string) {
        this.creator = new ModifyCreator(this.bridges, this.rocketletId);
        this.updater = new ModifyUpdater(this.bridges, this.rocketletId);
        this.extender = new ModifyExtender(this.bridges, this.rocketletId);
    }

    public getCreator(): IModifyCreator {
        return this.creator;
    }

    public getUpdater(): IModifyUpdater {
        return this.updater;
    }

    public getExtender(): IModifyExtender {
        return this.extender;
    }
}
