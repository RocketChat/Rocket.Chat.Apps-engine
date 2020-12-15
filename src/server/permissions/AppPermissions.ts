import { ApisPermissions } from './AppApisBridge';
import { CommandPermissions } from './AppCommandBridge';
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
    'user': UserPermissions,
    'upload': UploadPermissions,
    'ui': UiInteractionPermissions,
    'server-setting': ServerSettingPermissions,
    'scheduler': SchedulerPermissions,
    'room': RoomPermissions,
    'persistence': PersistencePermissions,
    'message': MessagePermissions,
    'livechat': LivechatPermissions,
    'http': HttpPermissions,
    'env': EnvPermissions,
    'app-details-change': AppDetailChangesPermissions,
    'command': CommandPermissions,
    'apis': ApisPermissions,
};
