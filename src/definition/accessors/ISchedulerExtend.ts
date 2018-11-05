import { IJob } from '../scheduler';
import { IJobBuilder } from './IJobBuilder';

export interface ISchedulerExtend {
    scheduleJob(job: IJob | IJobBuilder): Promise<void>;

    getJobBuilder(job?: IJob): IJobBuilder;
}
