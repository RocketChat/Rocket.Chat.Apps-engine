import { IPermission } from '../../definition/permission/AppPermission';
import { ISetting } from '../../definition/settings';

export const ServerSettingPermissions: { [permission: string]: IPermission } = {
    // getAll, getOneById, isReadableById
    'server-setting.read': {
        name: 'server-setting.read',
    },
    // hideGroup, hideSetting, updateOne
    'server-setting.write': {
        name: 'server-setting.write',
    },
};

export const AppServerSettingBridge = {
    getAll(appId: string): void {
        return;
    },
    getOneById(id: string, appId: string): void {
        return;
    },
    hideGroup(name: string, appId: string): void {
        return;
    },
    hideSetting(id: string, appId: string): void {
        return;
    },
    isReadableById(id: string, appId: string): void {
        return;
    },
    updateOne(setting: ISetting, appId: string): void {
        return;
    },
};
