import { ISchedulerModify } from '../../definition/accessors';
import {
    IOnetimeSchedule,
    IRecurringSchedule,
} from '../../definition/scheduler';
import { AppSchedulerManager } from '../managers/AppSchedulerManager';

export class SchedulerModify implements ISchedulerModify {
    constructor(private readonly manager: AppSchedulerManager, private readonly appId: string) {}

    public async scheduleOnce(job: IOnetimeSchedule): Promise<void> {
        this.manager.scheduleOnce(job, this.appId);
    }

    public async scheduleRecurring(job: IRecurringSchedule): Promise<void> {
        this.manager.scheduleRecurring(job, this.appId);
    }
}
