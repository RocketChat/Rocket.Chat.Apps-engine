import { INetworkingPermission, IPermission } from '../../definition/permissions/IPermission';

/**
 * @description
 *
 * App Permission naming rules:
 *
 * 'scope-name': {
 *    'permission-name': { name: 'scope-name.permission-name' }
 * }
 *
 * You can retrive this permission by using:
 * AppPermissions['scope-name']['permission-name'] -> { name: 'scope-name.permission-name' }
 *
 * @example
 *
 * AppPermissions.http.general // { name: 'http.general', domains: [] }
 */
export const AppPermissions = {
    'user': {
        read: { name: 'user.read' },
        write: { name: 'user.write' },
    },
    'upload': {
        read: { name: 'upload.read' },
        write: { name: 'upload.write' },
    },
    'ui': {
        interaction: { name: 'ui.interaction' },
    },
    'server-setting': {
        read: { name: 'server-setting.read' },
        write: { name: 'server-setting.write' },
    },
    'scheduler': {
        general: { name: 'scheduler.general' },
    },
    'room': {
        read: { name: 'room.read' },
        write: { name: 'room.write' },
    },
    'persistence': {
        read: { name: 'persistence.read' },
        write: { name: 'persistence.write' },
    },
    'message': {
        read: { name: 'message.read' },
        write: { name: 'message.write' },
        notification: { name: 'message.notification' },
    },
    'livechat': {
        read: { name: 'livechat.read' },
        write: { name: 'livechat.write' },
    },
    'networking': {
        general: { name: 'networking.general', domains: [] } as INetworkingPermission,
    },
    'env': {
        read: { name: 'env.read' },
    },
    'command': {
        read: { name: 'command.read' },
        write: { name: 'command.write' },
    },
    'apis': {
        general: { name: 'apis.general' },
    },
};

export const defaultPermissions: Array<IPermission> = [
    AppPermissions.user.read,
    AppPermissions.user.write,
    AppPermissions.upload.read,
    AppPermissions.upload.write,
    AppPermissions.ui.interaction,
    AppPermissions['server-setting'].read,
    AppPermissions['server-setting'].write,
    AppPermissions.scheduler.general,
    AppPermissions.room.read,
    AppPermissions.room.write,
    AppPermissions.persistence.read,
    AppPermissions.persistence.write,
    AppPermissions.message.read,
    AppPermissions.message.write,
    AppPermissions.message.notification,
    AppPermissions.livechat.read,
    AppPermissions.livechat.write,
    AppPermissions.networking.general,
    AppPermissions.env.read,
    AppPermissions.command.read,
    AppPermissions.command.write,
    AppPermissions.apis.general,
];
