export interface IPermission {
    name: string;
    required?: boolean;
}

export interface IHttpPermission extends IPermission {
    name: string;
    domains: Array<string>;
}
