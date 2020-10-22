export interface ISchedulerModify {
    scheduleOnce(id: string, when: Date, data: object): Promise<void>;
    scheduleRecurring(id: string, cron: Date, data: object): Promise<void>;
}
