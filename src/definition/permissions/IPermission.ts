export interface IPermission {
    name: string;
    required?: boolean;
}

export interface INetworkingPermission extends IPermission {
    name: string;
    domains: Array<string>;
}
