import { IPermission } from '../../definition/permission/IPermission';
import { AppApi } from '../managers/AppApi';

export const ApisPermissions: { [permission: string]: IPermission } = {
    // registerApi, unregisterApis
    apis: {
        name: 'apis',
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
