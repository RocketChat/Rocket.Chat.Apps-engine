import {IHttp, IModify, IPersistence, IRead} from '../accessors';

/** Represents a processor that is used by the scheduler methods */
export interface IProcessor {
    /** The processor's identifier */
    id: string;
    /** The function that will be run on a given scheudle */
    processor: (jobContext: IJobContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence) => Promise<void>;
}

/** The `data` object provided to the processor during the registering process */
export interface IJobContext {
    [key: string]: any;
}
