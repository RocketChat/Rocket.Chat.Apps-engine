import { IModify, IModifyCreator, IModifyExtender, IModifyUpdater } from 'temporary-rocketlets-ts-definition/accessors';
import { RocketletBridges } from '../bridges';

export class Modify implements IModify {
    constructor(private readonly bridges: RocketletBridges, private readonly rocketletId: string) { }

    public getCreator(): IModifyCreator {
        throw new Error('Method not implemented.');
    }

    public getUpdater(): IModifyUpdater {
        throw new Error('Method not implemented.');
    }

    public getExtender(): IModifyExtender {
        throw new Error('Method not implemented.');
    }
}
