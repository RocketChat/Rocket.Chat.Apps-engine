import { IOnetimeSchedule, IProcessor, IRecurringSchedule } from '../../../src/definition/scheduler';
import { SchedulerBridge } from '../../../src/server/bridges';

export class TestSchedulerBridge {
    public async doRegisterProcessors(processors: Array<IProcessor>, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public async doScheduleOnce(job: IOnetimeSchedule, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public async doScheduleRecurring(job: IRecurringSchedule, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public async doCancelJob(jobId: string, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public async doCancelAllJobs(appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

}
