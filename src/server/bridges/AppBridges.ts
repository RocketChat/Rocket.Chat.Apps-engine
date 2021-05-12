import { IAppActivationBridge } from './IAppActivationBridge';
import { IAppApiBridge } from './IAppApiBridge';
import { IAppCommandBridge } from './IAppCommandBridge';
import { IAppDetailChangesBridge } from './IAppDetailChangesBridge';
import { IAppSchedulerBridge } from './IAppSchedulerBridge';
import { ICloudWorkspaceBridge } from './ICloudWorkspaceBridge';
import { IEnvironmentalVariableBridge } from './IEnvironmentalVariableBridge';
import { IHttpBridge } from './IHttpBridge';
import { IInternalBridge } from './IInternalBridge';
import { IListenerBridge } from './IListenerBridge';
import { LivechatBridge } from './LivechatBridge';
import { IMessageBridge } from './IMessageBridge';
import { PersistenceBridge } from './PersistenceBridge';
import { RoomBridge } from './RoomBridge';
import { IServerSettingBridge } from './IServerSettingBridge';
import { IUiInteractionBridge } from './IUiInteractionBridge';
import { IUploadBridge } from './IUploadBridge';
import { UserBridge } from './UserBridge';
export type Bridge = IAppCommandBridge
            | IAppApiBridge
            | IAppDetailChangesBridge
            | IEnvironmentalVariableBridge
            | IHttpBridge
            | IListenerBridge
            | LivechatBridge
            | IMessageBridge
            | PersistenceBridge
            | IAppActivationBridge
            | RoomBridge
            | IInternalBridge
            | IServerSettingBridge
            | IUploadBridge
            | UserBridge
            | IUiInteractionBridge
            | IAppSchedulerBridge;

export abstract class AppBridges {
    public abstract getCommandBridge(): IAppCommandBridge;
    public abstract getApiBridge(): IAppApiBridge;
    public abstract getAppDetailChangesBridge(): IAppDetailChangesBridge;
    public abstract getEnvironmentalVariableBridge(): IEnvironmentalVariableBridge;
    public abstract getHttpBridge(): IHttpBridge;
    public abstract getListenerBridge(): IListenerBridge;
    public abstract getLivechatBridge(): LivechatBridge;
    public abstract getMessageBridge(): IMessageBridge;
    public abstract getPersistenceBridge(): PersistenceBridge;
    public abstract getAppActivationBridge(): IAppActivationBridge;
    public abstract getRoomBridge(): RoomBridge;
    public abstract getInternalBridge(): IInternalBridge;
    public abstract getServerSettingBridge(): IServerSettingBridge;
    public abstract getUploadBridge(): IUploadBridge;
    public abstract getUserBridge(): UserBridge;
    public abstract getUiInteractionBridge(): IUiInteractionBridge;
    public abstract getSchedulerBridge(): IAppSchedulerBridge;
    public abstract getCloudWorkspaceBridge(): ICloudWorkspaceBridge;
}
