import { IHttp, IModify, IPersistence, IRead } from './../accessors';
import { IJobResult } from './IJobResult';
import { Schedule } from './Schedule';

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
    schedule: Schedule;
    data: { [key: string]: any };
    executor(job: IJob, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IJobResult>;
}
