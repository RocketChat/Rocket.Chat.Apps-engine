import { IRocketletCommandBridge } from './IRocketletCommandBridge';

export abstract class RocketletBridges {
    public abstract getCommandBridge(): IRocketletCommandBridge;
}
