import {
    IOnetimeSchedule,
    IProcessor,
    IRecurringSchedule,
} from '../../definition/scheduler';

/**
 * The interface which should be implemented for the apps to have
 * access to the Job Scheduler
 */
export interface IAppSchedulerBridge {
    /**
     * Register processors that can be scheduled to run
     *
     * @param {Array<IProcessor>} processors An array of processors
     * @param appId the id of the app calling this
     */
    registerProcessors(processor: Array<IProcessor>, appId: string): Promise<void>;

    /**
     * Schedules a registered processor to run _once_.
     *
     * @param {IOnetimeSchedule} job
     * @param appId the id of the app calling this
     */
    scheduleOnce(job: IOnetimeSchedule, appId: string): Promise<void>;
    /**
     * Schedules a registered processor to run in recurrencly acording to a given interval
     *
     * @param {IRecurringSchedule} job
     * @param appId the id of the app calling this
     */
    scheduleRecurring(job: IRecurringSchedule, appId: string): Promise<void>;
    /**
     * Cancels a running job given its jobId
     *
     * @param {string} jobId
     * @param appId the id of the app calling this
     */
    cancelJob(jobId: string, appId: string): Promise<void>;
    /**
     * Cancels all the running jobs from the app
     *
     * @param appId the id of the app calling this
     */
    cancelAllJobs(appId: string): Promise<void>;
}
