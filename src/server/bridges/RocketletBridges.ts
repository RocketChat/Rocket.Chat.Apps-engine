import { IEnvironmentalVariableBridge } from './IEnvironmentalVariableBridge';
import { IMessageBridge } from './IMessageBridge';
import { IRocketletCommandBridge } from './IRocketletCommandBridge';
import { IServerSettingBridge } from './IServerSettingBridge';

export abstract class RocketletBridges {
    public abstract getCommandBridge(): IRocketletCommandBridge;
    public abstract getServerSettingBridge(): IServerSettingBridge;
    public abstract getEnvironmentalVariableBridge(): IEnvironmentalVariableBridge;
    public abstract getMessageBridge(): IMessageBridge;
}
