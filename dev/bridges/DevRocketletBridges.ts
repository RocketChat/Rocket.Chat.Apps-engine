import { IRocketletCommandBridge, RocketletBridges } from '../../src/server/bridges';
import { DevCommandBridge } from './DevCommandBridge';

export class DevRocketletBridges extends RocketletBridges {
    private cmdBridge: DevCommandBridge;

    constructor() {
        super();
        this.cmdBridge = new DevCommandBridge();
    }

    public getCommandBridge(): IRocketletCommandBridge {
        return this.cmdBridge;
    }
}
