import { IOnetimeSchedule, IProcessor, IRecurringSchedule } from '../../../src/definition/scheduler';
import { IAppSchedulerBridge } from '../../../src/server/bridges';

export class TestSchedulerBridge implements IAppSchedulerBridge {
    public async registerProcessors(processors: Array<IProcessor>, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public async scheduleOnce(job: IOnetimeSchedule, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public async scheduleRecurring(job: IRecurringSchedule, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public async cancelJob(jobId: string, appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public async cancelAllJobs(appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

}
