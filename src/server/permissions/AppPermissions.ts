import { IHttpPermission, IPermission } from '../../definition/permissions/IPermission';

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
    'http': {
        general: { name: 'http.general', domains: [] },
    },
    'env': {
        read: { name: 'env.read' },
    },
    'app-details-change': {
        settings: { name: 'app-details.settings' },
    },
    'command': {
        read: { name: 'command.read' },
        write: { name: 'command.write' },
    },
    'apis': {
        general: { name: 'apis.general' },
    },
} as { [scope: string]: { [name: string]: IPermission } };

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
