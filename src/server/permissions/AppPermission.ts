import { ApisPermissions } from './AppApisBridge';
import { CommndPermissions } from './AppCommandBridge';
import { AppDetailChangesPermissions } from './AppDetailChangesBridge';
import { EnvPermissions } from './AppEnvironmentalVariableBridge';
import { HttpPermissions } from './AppHttpBridge';
import { LivechatPermissions } from './AppLivechatBridge';
import { MessagePermissions } from './AppMessageBridge';
import { PersistencePermissions } from './AppPersistenceBridge';
import { RoomPermissions } from './AppRoomBridge';
import { SchedulerPermissions } from './AppSchedulerBridge';
import { ServerSettingPermissions } from './AppServerSettingBridge';
import { UiInteractionPermissions } from './AppUiInteractionBridge';
import { UploadPermissions } from './AppUploadBridge';
import { UserPermissions } from './AppUserBridge';

export const AppPermissions = {
    UserPermissions,
    UploadPermissions,
    UiInteractionPermissions,
    ServerSettingPermissions,
    SchedulerPermissions,
    RoomPermissions,
    PersistencePermissions,
    MessagePermissions,
    LivechatPermissions,
    HttpPermissions,
    EnvPermissions,
    AppDetailChangesPermissions,
    CommndPermissions,
    ApisPermissions,
};
