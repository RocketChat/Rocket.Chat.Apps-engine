import { Schedule } from './Schedule';

/**
 * A job will return this value when their job completes or fails.
 * We provide an option to then reschedule a job, ideally used when
 * the job fails but could be used to run it again. Should the job
 * fail to run and throw an error, we will automatically mark it as
 * a failure and not rerun it.
 */
export interface IJobResult {
    /** Whether or not the job was successful. */
    success: boolean;
    /**
     * When to reschedule the job.
     * This is useful for if it failed and you know
     * when it should be ran again.
     */
    reschedule?: Schedule;
}
