export interface IPermissionCheckers {
    [bridge: string]: {
        [method: string]: (...args: Array<any>) => void;
    };
}
