import { IHttpPermission, IPermission } from '../../definition/permissions/IPermission';

// Apis
const ApisPermissions: { [permission: string]: IPermission } = {
    // registerApi, unregisterApis
    general: {
        name: 'apis.general',
    },
};

// SlashCommand
const CommandPermissions: { [permission: string]: IPermission } = {
    // doesCommandExist
    read: {
        name: 'command.read',
    },
    // enableCommand, disableCommand, modifyCommand, restoreCommand, registerCommand
    // unregisterCommand
    write: {
        name: 'command.write',
    },
};

// AppDetailsChange
export const AppDetailChangesPermissions: { [permission: string]: IPermission } = {
    // onAppSettingsChnages
    settings: {
        name: 'app-details.settings',
    },
};

// Env
const EnvPermissions: { [permission: string]: IPermission } = {
    // getValueByName, isReadable, isSet
    read: {
        name: 'env.read',
    },
};

// Http
const HttpPermissions: { [permission: string]: IHttpPermission } = {
    // call
    general: {
        name: 'http.general',
        domains: [],
    },
};

// Livechat
const LivechatPermissions: { [permission: string]: IPermission } = {
    // isOnline, isOnlineAsync
    // getMessageById, findVisitors, findVisitorsById
    // findVisitorsByEamil, findVisitorsByToken
    // findRooms, findDepartmentByIdOrName
    read: {
        name: 'livechat.read',
    },
    // createMessage, updateMessage
    // creaetVisitor, transferVisitor
    // createRoom, closeRoom, setCustomFields
    write: {
        name: 'livechat.write',
    },
};

// Message
const MessagePermissions: { [permission: string]: IPermission } = {
    // getById
    read: {
        name: 'message.read',
    },
    // create, update
    write: {
        name: 'message.write',
    },
    // notifyUser, notifyRoom, typing
    notification: {
        name: 'message.notification',
    },
};

// Persistence
const PersistencePermissions: { [permission: string]: IPermission } = {
    // getById, getByName, getCreatorById, getCreatorByName, getDirectByUsernames, getMembers
    general: {
        name: 'persistence.general',
    },
};

// Room
const RoomPermissions: { [permission: string]: IPermission } = {
    // getById, getByName, getCreatorById, getCreatorByName, getDirectByUsernames, getMembers
    read: {
        name: 'room.read',
    },
    // create, update, createDsicussions
    write: {
        name: 'room.write',
    },
};

// Scheduler
const SchedulerPermissions: { [permission: string]: IPermission } = {
    general: {
        name: 'scheduler.general',
    },
};

// ServerSetting
const ServerSettingPermissions: { [permission: string]: IPermission } = {
    // getAll, getOneById, isReadableById
    read: {
        name: 'server-setting.read',
    },
    // hideGroup, hideSetting, updateOne
    write: {
        name: 'server-setting.write',
    },
};

// UiInteraction
const UiInteractionPermissions: { [permission: string]: IPermission } = {
    // notifyUser
    interaction: {
        name: 'ui.interaction',
    },
};

// Upload
const UploadPermissions: { [permission: string]: IPermission } = {
    // getById, getBuffer
    read: {
        name: 'upload.read',
    },
    // createUpload
    write: {
        name: 'upload.write',
    },
};

// User
const UserPermissions: { [permission: string]: IPermission } = {
    // getById, getByUsername, getAppUser, getActiveUserCount
    read: {
        name: 'user.read',
    },
    // create, update, remove
    write: {
        name: 'user.write',
    },
};

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

export const defaultPermissions: Array<IPermission> = [
    { name: 'user.read' },
    { name: 'user.write' },
    { name: 'upload.read' },
    { name: 'upload.write' },
    { name: 'ui.interaction' },
    { name: 'server-setting.read' },
    { name: 'server-setting.write' },
    { name: 'scheduler.general' },
    { name: 'room.read' },
    { name: 'room.write' },
    { name: 'persistence.general' },
    { name: 'message.read' },
    { name: 'message.write' },
    { name: 'message.notification' },
    { name: 'livechat.read' },
    { name: 'livechat.write' },
    { name: 'http.general', domains: ['*'] } as IHttpPermission,
    { name: 'env.read' },
    { name: 'app-details.settings' },
    { name: 'command.read' },
    { name: 'command.write' },
    { name: 'apis.general' },
];
