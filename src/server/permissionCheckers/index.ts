import { IPermissionCheckers } from '../../definition/permission/IPermissionCheckers';
import { AppActivationBridge } from './AppActivationBridge';
import { AppApiBridge } from './AppApiBridge';
import { AppCommandBridge } from './AppCommandBridge';
import { AppDetailChangesBridge } from './AppDetailChangesBridge';
import { AppEnvironmentalVariableBridge } from './AppEnvironmentalVariableBridge';
import { AppHttpBridge } from './AppHttpBridge';
import { AppInternalBridge } from './AppInternalBridge';
import { AppLivechatBridge } from './AppLivechatBridge';
import { AppMessageBridge } from './AppMessageBridge';
import { AppPersistenceBridge } from './AppPersistenceBridge';
import { AppRoomBridge } from './AppRoomBridge';
import { AppSchedulerBridge } from './AppSchedulerBridge';
import { AppServerSettingBridge } from './AppServerSettingBridge';
import { AppUiInteractionBridge } from './AppUiInteractionBridge';
import { AppUploadBridge } from './AppUploadBridge';
import { AppUserBridge } from './AppUserBridge';

export const permissionCheckers = {
    AppActivationBridge,
    AppApiBridge,
    AppCommandBridge,
    AppDetailChangesBridge,
    AppEnvironmentalVariableBridge,
    AppHttpBridge,
    AppInternalBridge,
    AppLivechatBridge,
    AppMessageBridge,
    AppPersistenceBridge,
    AppRoomBridge,
    AppSchedulerBridge,
    AppServerSettingBridge,
    AppUiInteractionBridge,
    AppUploadBridge,
    AppUserBridge,
} as IPermissionCheckers;
