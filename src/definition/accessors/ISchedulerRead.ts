import { IJob } from '../scheduler';

export interface ISchedulerRead {
    /** Gets all of the jobs for this App. */
    getJobs(): Promise<Array<IJob>>;
}
