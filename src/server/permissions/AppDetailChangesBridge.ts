import { IPermission } from '../../definition/permission/IPermission';
import { ISetting } from '../../definition/settings';

export const AppDetailChangesPermissions: { [permission: string]: IPermission } = {
    // onAppSettingsChnages
    'app-detail-changes.settings': {
        name: 'app-detail-changes.settings',
    },
};

export const AppDetailChangesBridge = {
    onAppSettingsChange(appId: string, setting: ISetting): void {
        return;
    },
};
