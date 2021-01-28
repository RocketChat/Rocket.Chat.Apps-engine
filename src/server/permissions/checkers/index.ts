import { IPermissionCheckers } from '../IPermissionCheckers';
import { AppActivationBridge } from './AppActivationBridge';
import { AppApisBridge } from './AppApisBridge';
import { AppCommandsBridge } from './AppCommandsBridge';
import { AppDetailChangesBridge } from './AppDetailChangesBridge';
import { AppEnvironmentalVariableBridge } from './AppEnvironmentalVariableBridge';
import { AppHttpBridge } from './AppHttpBridge';
import { AppInternalBridge } from './AppInternalBridge';
import { AppLivechatBridge } from './AppLivechatBridge';
import { AppMessageBridge } from './AppMessageBridge';
import { AppPersistenceBridge } from './AppPersistenceBridge';
import { AppRoomBridge } from './AppRoomBridge';
import { AppSchedulerBridge } from './AppSchedulerBridge';
import { AppSettingBridge } from './AppSettingBridge';
import { AppUiInteractionBridge as UiInteractionBridge } from './AppUiInteractionBridge';
import { AppUploadBridge } from './AppUploadBridge';
import { AppUserBridge } from './AppUserBridge';

export const permissionCheckers = {
    AppActivationBridge,
    AppApisBridge,
    AppCommandsBridge,
    AppDetailChangesBridge,
    AppEnvironmentalVariableBridge,
    AppHttpBridge,
    AppInternalBridge,
    AppLivechatBridge,
    AppMessageBridge,
    AppPersistenceBridge,
    AppRoomBridge,
    AppSchedulerBridge,
    AppSettingBridge,
    UiInteractionBridge,
    AppUploadBridge,
    AppUserBridge,
} as IPermissionCheckers;
