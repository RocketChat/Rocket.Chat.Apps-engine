import {
    IOnetimeSchedule,
    IRecurringSchedule,
} from '../scheduler';

export interface ISchedulerModify {
    scheduleOnce(job: IOnetimeSchedule): Promise<void>;
    scheduleRecurring(job: IRecurringSchedule): Promise<void>;
    cancelScheduledJob(jobId: string): Promise<void>;
    removeAllJobs(): Promise<void>;
}
