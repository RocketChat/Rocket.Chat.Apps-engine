import {
    IOnetimeSchedule,
    IRecurringSchedule,
} from '../scheduler';

/**
 * This accessor provides methods to work with the Job Scheduler
 */
export interface ISchedulerModify {
    /**
     * Schedules a registered processor to run _once_. The date can be
     * in the [human-interval](https://github.com/agenda/human-interval) format
     * or a `Date` object.
     *
     * @param {IOnetimeSchedule} job
     */
    scheduleOnce(job: IOnetimeSchedule): Promise<void>;
    /**
     * Schedules a registered processor to run in recurrencly acording to a given interval
     * The interval must follow [human-interval](https://github.com/agenda/human-interval) format
     *
     * @param {IRecurringSchedule} job
     */
    scheduleRecurring(job: IRecurringSchedule): Promise<void>;
    /**
     * Cancels a running job given its jobId
     *
     * @param {string} jobId
     */
    cancelJob(jobId: string): Promise<void>;
    /**
     * Cancels all the running jobs from the app
     */
    cancelAllJobs(): Promise<void>;
}
