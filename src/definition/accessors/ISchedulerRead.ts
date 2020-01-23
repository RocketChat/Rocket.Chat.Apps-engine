import { IJob } from '../scheduler';
import { IUser } from '../users';

export interface ISchedulerRead {
    /** Gets all of the jobs for this App. */
    getJobs(): Promise<Array<IJob>>;
    /** Gets all of the jobs which have been created by the provided user for this App. */
    getJobsByCreator(user: IUser): Promise<Array<IJob>>;
    /** Gets a job by the provided id which this App created. */
    getJobById(id: string): Promise<IJob>;
}
