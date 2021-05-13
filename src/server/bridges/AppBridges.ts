import { HttpBridge } from './HttpBridge';
import { IAppActivationBridge } from './IAppActivationBridge';
import { ApiBridge } from './ApiBridge';
import { CommandBridge } from './CommandBridge';
import { IAppDetailChangesBridge } from './IAppDetailChangesBridge';
import { SchedulerBridge } from './SchedulerBridge';
import { ICloudWorkspaceBridge } from './ICloudWorkspaceBridge';
import { EnvironmentalVariableBridge } from './EnvironmentalVariableBridge';
import { IInternalBridge } from './IInternalBridge';
import { IListenerBridge } from './IListenerBridge';
import { ServerSettingBridge } from './ServerSettingBridge';
import { IUiInteractionBridge } from './IUiInteractionBridge';
import { LivechatBridge } from './LivechatBridge';
import { MessageBridge } from './MessageBridge';
import { PersistenceBridge } from './PersistenceBridge';
import { RoomBridge } from './RoomBridge';
import { UploadBridge } from './UploadBridge';
import { UserBridge } from './UserBridge';
export type Bridge = CommandBridge
            | ApiBridge
            | IAppDetailChangesBridge
            | EnvironmentalVariableBridge
            | HttpBridge
            | IListenerBridge
            | LivechatBridge
            | MessageBridge
            | PersistenceBridge
            | IAppActivationBridge
            | RoomBridge
            | IInternalBridge
            | ServerSettingBridge
            | UploadBridge
            | UserBridge
            | IUiInteractionBridge
            | SchedulerBridge;

export abstract class AppBridges {
    public abstract getCommandBridge(): CommandBridge;
    public abstract getApiBridge(): ApiBridge;
    public abstract getAppDetailChangesBridge(): IAppDetailChangesBridge;
    public abstract getEnvironmentalVariableBridge(): EnvironmentalVariableBridge;
    public abstract getHttpBridge(): HttpBridge;
    public abstract getListenerBridge(): IListenerBridge;
    public abstract getLivechatBridge(): LivechatBridge;
    public abstract getMessageBridge(): MessageBridge;
    public abstract getPersistenceBridge(): PersistenceBridge;
    public abstract getAppActivationBridge(): IAppActivationBridge;
    public abstract getRoomBridge(): RoomBridge;
    public abstract getInternalBridge(): IInternalBridge;
    public abstract getServerSettingBridge(): ServerSettingBridge;
    public abstract getUploadBridge(): UploadBridge;
    public abstract getUserBridge(): UserBridge;
    public abstract getUiInteractionBridge(): IUiInteractionBridge;
    public abstract getSchedulerBridge(): SchedulerBridge;
    public abstract getCloudWorkspaceBridge(): ICloudWorkspaceBridge;
}
