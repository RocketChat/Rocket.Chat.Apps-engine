import {IHttp, IModify, IPersistence, IRead} from '../accessors';

/** Represents a processor that is used by the scheduler methods */
export interface IProcessor {
    /** The processor's identifier */
    id: string;
    /** The function that will be run on a given scheudle */
    processor: (jobContext: IJobContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence) => Promise<void>;
    /** If provided, the processor will be configured with the setting as soon as it gets registered */
    startupSetting?: StartupSetting;
}

/** The `data` object provided to the processor during the registering process */
export interface IJobContext {
    [key: string]: any;
}

type StartupSetting = IOnetimeStartup | IRecurringStartup | null;

export interface IOnetimeStartup {
    type: StartupType.ONETIME;
    when: string;
}

export interface IRecurringStartup {
    type: StartupType.RECURRING;
    cron: string;
}

export enum StartupType {
    ONETIME = 'onetime',
    RECURRING = 'recurring',
}
