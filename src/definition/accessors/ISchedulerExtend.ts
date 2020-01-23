import { IJob, Schedule } from '../scheduler';

export interface ISchedulerExtend {
    /**
     * Schedules a job to be ran with the provided schedule.
     *
     * @param job the job to schedule
     * @param schedule the schedule of when to run the job
     * @returns the id of the job
     */
    scheduleJob(job: IJob, schedule: Schedule): Promise<string>;
}
