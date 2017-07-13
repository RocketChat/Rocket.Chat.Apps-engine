import { IEnvironmentalVariableBridge } from './IEnvironmentalVariableBridge';
import { IRocketletCommandBridge } from './IRocketletCommandBridge';
import { IServerSettingBridge } from './IServerSettingBridge';

export abstract class RocketletBridges {
    public abstract getCommandBridge(): IRocketletCommandBridge;
    public abstract getServerSettingBridge(): IServerSettingBridge;
    public abstract getEnvironmentalVariableBridge(): IEnvironmentalVariableBridge;
}
