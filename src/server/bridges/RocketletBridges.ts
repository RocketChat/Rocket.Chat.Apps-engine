import { IEnvironmentalVariableBridge } from './IEnvironmentalVariableBridge';
import { IMessageBridge } from './IMessageBridge';
import { IPersistenceBridge } from './IPersistenceBridge';
import { IRocketletCommandBridge } from './IRocketletCommandBridge';
import { IRoomBridge } from './IRoomBridge';
import { IServerSettingBridge } from './IServerSettingBridge';
import { IUserBridge } from './IUserBridge';

export abstract class RocketletBridges {
    public abstract getCommandBridge(): IRocketletCommandBridge;
    public abstract getEnvironmentalVariableBridge(): IEnvironmentalVariableBridge;
    public abstract getMessageBridge(): IMessageBridge;
    public abstract getPersistenceBridge(): IPersistenceBridge;
    public abstract getRoomBridge(): IRoomBridge;
    public abstract getServerSettingBridge(): IServerSettingBridge;
    public abstract getUserBridge(): IUserBridge;
}
