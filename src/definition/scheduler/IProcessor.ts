import {IHttp, IModify, IPersistence, IRead} from '../accessors';

export interface IProcessor {
    id: string;
    processor: (jobContext: IJobContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence) => Promise<void>;
}

export interface IJobContext {
    [key: string]: any;
}
