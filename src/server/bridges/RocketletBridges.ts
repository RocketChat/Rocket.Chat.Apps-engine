import { IEnvironmentalVariableBridge } from './IEnvironmentalVariableBridge';
import { IHttpBridge } from './IHttpBridge';
import { IMessageBridge } from './IMessageBridge';
import { IPersistenceBridge } from './IPersistenceBridge';
import { IRocketletActivationBridge } from './IRocketletActivationBridge';
import { IRocketletCommandBridge } from './IRocketletCommandBridge';
import { IRoomBridge } from './IRoomBridge';
import { IServerSettingBridge } from './IServerSettingBridge';
import { IUserBridge } from './IUserBridge';

export abstract class RocketletBridges {
    public abstract getCommandBridge(): IRocketletCommandBridge;
    public abstract getEnvironmentalVariableBridge(): IEnvironmentalVariableBridge;
    public abstract getHttpBridge(): IHttpBridge;
    public abstract getMessageBridge(): IMessageBridge;
    public abstract getPersistenceBridge(): IPersistenceBridge;
    public abstract getRocketletActivationBridge(): IRocketletActivationBridge;
    public abstract getRoomBridge(): IRoomBridge;
    public abstract getServerSettingBridge(): IServerSettingBridge;
    public abstract getUserBridge(): IUserBridge;
}
