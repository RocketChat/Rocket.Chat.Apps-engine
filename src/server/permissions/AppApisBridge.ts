import { IPermission } from '../../definition/permission/IPermission';
import { AppApi } from '../managers/AppApi';

export const ApisPermissions: { [permission: string]: IPermission } = {
    // registerApi, unregisterApis
    general: {
        name: 'apis.general',
    },
};

export const AppApisBridge = {
    registerApi(api: AppApi, appId: string): void {
        return;
    },
    unregisterApis(appId: string): void {
        return;
    },
};
