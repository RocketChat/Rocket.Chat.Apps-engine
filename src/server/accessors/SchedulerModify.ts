import { ISchedulerModify } from '../../definition/accessors';
import {
    IOnetimeSchedule,
    IRecurringSchedule,
} from '../../definition/scheduler';
import { IAppSchedulerBridge } from '../bridges';

function createProcessorId(jobId: string, appId: string): string {
    return jobId.includes(`_${appId}`) ? jobId : `${ jobId }_${ appId }`;
}

export class SchedulerModify implements ISchedulerModify {
    constructor(private readonly bridge: IAppSchedulerBridge, private readonly appId: string) {}

    public async scheduleOnce(job: IOnetimeSchedule): Promise<void> {
        this.bridge.scheduleOnce({ ...job, id: createProcessorId(job.id, this.appId) }, this.appId);
    }

    public async scheduleRecurring(job: IRecurringSchedule): Promise<void> {
        this.bridge.scheduleRecurring({ ...job, id: createProcessorId(job.id, this.appId) }, this.appId);
    }

    public async cancelJob(jobId: string): Promise<void> {
        this.bridge.cancelJob(createProcessorId(jobId, this.appId), this.appId);
    }

    public async cancelAllJobs(): Promise<void> {
        this.bridge.cancelAllJobs(this.appId);
    }
}
