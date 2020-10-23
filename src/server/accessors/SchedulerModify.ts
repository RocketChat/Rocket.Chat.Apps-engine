import { ISchedulerModify } from '../../definition/accessors';
import {
    IOnetimeSchedule,
    IRecurringSchedule,
} from '../../definition/scheduler';
import { IAppSchedulerBridge } from '../bridges';

export class SchedulerModify implements ISchedulerModify {
    constructor(private readonly bridge: IAppSchedulerBridge, private readonly appId: string) {}

    public async scheduleOnce(job: IOnetimeSchedule): Promise<void> {
        this.bridge.scheduleOnce(job, this.appId);
    }

    public async scheduleRecurring(job: IRecurringSchedule): Promise<void> {
        this.bridge.scheduleRecurring(job, this.appId);
    }
}
