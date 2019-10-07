import { IUser } from '../users';
import { IHttp, IModify, IPersistence, IRead } from './../accessors';
import { IJobResult } from './IJobResult';

export interface IJob {
    /**
     * The name of the job. As this property is not unique,
     * we recommend setting this to something that is
     * user friendly since the list of job names will be visible
     * to the server administrator.
     */
    name: string;
    /** A brief description of what this job is for. */
    description?: string;
    /** The user who created this job, but not always required. */
    creator?: IUser;

    /**
     * The function which gets excuted when the job runs.
     * See the IJobResult documentation for what to return.
     */
    executor(read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IJobResult>;
}
