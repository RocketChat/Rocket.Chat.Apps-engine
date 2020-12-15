import { IOnetimeSchedule, IProcessor, IRecurringSchedule } from '../../../definition/scheduler';

export const AppSchedulerBridge = {
    registerProcessors(processor: Array<IProcessor>, appId: string): void {
        return;
    },
    scheduleOnce(job: IOnetimeSchedule, appId: string): void {
        return;
    },
    scheduleRecurring(job: IRecurringSchedule, appId: string): void {
        return;
    },
    cancelJob(jobId: string, appId: string): void {
        return;
    },
    cancelAllJobs(appId: string): void {
        return;
    },
};
