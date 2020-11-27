import { IPermission } from '../../definition/permission/AppPermission';

export const EnvPermissions: { [permission: string]: IPermission } = {
    // getValueByName, isReadable, isSet
    'env.read': {
        name: 'env.read',
    },
};

export const AppEnvironmentalVariableBridge = {
    getValueByName(envVarName: string, appId: string): void {
        return;
    },
    isReadable(envVarName: string, appId: string): void {
        return;
    },
    isSet(envVarName: string, appId: string): void {
        return;
    },
};
