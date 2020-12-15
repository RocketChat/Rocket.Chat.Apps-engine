import { IPermission } from '../../definition/permission/IPermission';

export const EnvPermissions: { [permission: string]: IPermission } = {
    // getValueByName, isReadable, isSet
    read: {
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
