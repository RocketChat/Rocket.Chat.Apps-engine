import { IOnetimeSchedule, IProcessor, IRecurringSchedule } from '../../../src/definition/scheduler';
import { IAppSchedulerBridge } from '../../../src/server/bridges';

export class TestSchedulerBridge implements IAppSchedulerBridge {
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
