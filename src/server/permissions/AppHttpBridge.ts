import { IHttpPermission } from '../../definition/permission/AppPermission';
import { IHttpBridgeRequestInfo } from '../bridges';

export const HttpPermissions: { [permission: string]: IHttpPermission } = {
    // call
    http: {
        name: 'http',
        domains: [],
    },
};

export const AppHttpBridge = {
    call(info: IHttpBridgeRequestInfo): void {
        return;
    },
};
