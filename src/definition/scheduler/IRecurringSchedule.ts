/** Represents a job that runs recurrently */
export interface IRecurringSchedule {
    /** The schedule's identifier */
    id: string;
    /**
     * When the job will be run. Must be a
     * [human-interval](https://github.com/agenda/human-interval)
     */
    cron: string;
    /** An object that can be passed to the processor with custom data */
    data?: object;
}
