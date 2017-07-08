export interface IGetRocketletsFilter {
    ids?: Array<number>;
    name?: string | RegExp;
    count?: number;
    enabled?: boolean;
    disabled?: boolean;
}
