import { IHttpPermission } from '../../definition/permission/IPermission';
import { IHttpBridgeRequestInfo } from '../bridges';

export const HttpPermissions: { [permission: string]: IHttpPermission } = {
    // call
    general: {
        name: 'http.general',
        domains: [],
    },
};

export const AppHttpBridge = {
    call(info: IHttpBridgeRequestInfo): void {
        return;
    },
};
