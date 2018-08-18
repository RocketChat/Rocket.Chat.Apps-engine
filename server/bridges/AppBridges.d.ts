import { IAppActivationBridge } from './IAppActivationBridge';
import { IAppCommandBridge } from './IAppCommandBridge';
import { IAppDetailChangesBridge } from './IAppDetailChangesBridge';
import { IEnvironmentalVariableBridge } from './IEnvironmentalVariableBridge';
import { IHttpBridge } from './IHttpBridge';
import { IListenerBridge } from './IListenerBridge';
import { IMessageBridge } from './IMessageBridge';
import { IPersistenceBridge } from './IPersistenceBridge';
import { IRoomBridge } from './IRoomBridge';
import { IServerSettingBridge } from './IServerSettingBridge';
import { IUserBridge } from './IUserBridge';
export declare abstract class AppBridges {
    abstract getCommandBridge(): IAppCommandBridge;
    abstract getAppDetailChangesBridge(): IAppDetailChangesBridge;
    abstract getEnvironmentalVariableBridge(): IEnvironmentalVariableBridge;
    abstract getHttpBridge(): IHttpBridge;
    abstract getListenerBridge(): IListenerBridge;
    abstract getMessageBridge(): IMessageBridge;
    abstract getPersistenceBridge(): IPersistenceBridge;
    abstract getAppActivationBridge(): IAppActivationBridge;
    abstract getRoomBridge(): IRoomBridge;
    abstract getServerSettingBridge(): IServerSettingBridge;
    abstract getUserBridge(): IUserBridge;
}
