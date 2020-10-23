import {
    IOnetimeSchedule,
    IProcessor,
    IRecurringSchedule,
} from '../../definition/scheduler';

export interface IAppSchedulerBridge {
    registerProcessor(processor: IProcessor, appId: string): void;
    scheduleOnce(job: IOnetimeSchedule, appId: string): Promise<void>;
    scheduleRecurring(job: IRecurringSchedule, appId: string): Promise<void>;
    cancelScheduledJob(jobId: string, appId: string): Promise<void>;
    removeAllJobs(appId: string): Promise<void>;
}