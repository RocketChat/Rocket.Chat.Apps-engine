import { Schedule } from './Schedule';

/**
 * A job **must** return this value when their job completes or fails.
 * We provide an option to reschedule the job, ideally used when
 * the job fails but could be used to run it again. If the job
 * fails to run or throws an error, we will automatically mark it as
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
