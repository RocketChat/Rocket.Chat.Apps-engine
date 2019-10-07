import { IJob, Schedule } from '../scheduler';

export interface ISchedulerExtend {
    /**
     * Schedules a job to be ran when on the given schedule.
     *
     * @param job the job to schedule
     * @param schedule the schedule of when to run the job
     */
    scheduleJob(job: IJob, schedule: Schedule): Promise<void>;
}
