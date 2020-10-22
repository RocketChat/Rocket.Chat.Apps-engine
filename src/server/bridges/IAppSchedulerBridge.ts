import { IProcessor, IOnetimeSchedule, IRecurringSchedule } from '../../definition/scheduler';

export interface IAppSchedulerBridge {
    registerProcessor(processor: IProcessor, appId: string): void;
    scheduleOnce(job: IOnetimeSchedule, appId: string): Promise<void>;
    scheduleRecurring(job: IRecurringSchedule, appId: string): Promise<void>;
}
