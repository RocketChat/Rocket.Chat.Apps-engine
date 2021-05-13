import { HttpBridge } from './HttpBridge';
import { IAppActivationBridge } from './IAppActivationBridge';
import { ApiBridge } from './ApiBridge';
import { CommandBridge } from './CommandBridge';
import { AppDetailChangesBridge } from './AppDetailChangesBridge';
import { SchedulerBridge } from './SchedulerBridge';
import { ICloudWorkspaceBridge } from './ICloudWorkspaceBridge';
import { EnvironmentalVariableBridge } from './EnvironmentalVariableBridge';
import { IInternalBridge } from './IInternalBridge';
import { IListenerBridge } from './IListenerBridge';
import { ServerSettingBridge } from './ServerSettingBridge';
import { UiInteractionBridge } from './UiInteractionBridge';
import { LivechatBridge } from './LivechatBridge';
import { MessageBridge } from './MessageBridge';
import { PersistenceBridge } from './PersistenceBridge';
import { RoomBridge } from './RoomBridge';
import { UploadBridge } from './UploadBridge';
import { UserBridge } from './UserBridge';
export type Bridge = CommandBridge
            | ApiBridge
            | AppDetailChangesBridge
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
            | UiInteractionBridge
            | SchedulerBridge;

export abstract class AppBridges {
    public abstract getCommandBridge(): CommandBridge;
    public abstract getApiBridge(): ApiBridge;
    public abstract getAppDetailChangesBridge(): AppDetailChangesBridge;
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
    public abstract getUiInteractionBridge(): UiInteractionBridge;
    public abstract getSchedulerBridge(): SchedulerBridge;
    public abstract getCloudWorkspaceBridge(): ICloudWorkspaceBridge;
}
