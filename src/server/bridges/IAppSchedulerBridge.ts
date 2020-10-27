import {
    IOnetimeSchedule,
    IProcessor,
    IRecurringSchedule,
} from '../../definition/scheduler';

export interface IAppSchedulerBridge {
    registerProcessors(processor: Array<IProcessor>, appId: string): void;
    scheduleOnce(job: IOnetimeSchedule, appId: string): Promise<void>;
    scheduleRecurring(job: IRecurringSchedule, appId: string): Promise<void>;
    cancelJob(jobId: string, appId: string): Promise<void>;
    cancelAllJobs(appId: string): Promise<void>;
}
