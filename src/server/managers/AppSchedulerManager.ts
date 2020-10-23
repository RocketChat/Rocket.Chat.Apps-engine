import {
    IOnetimeSchedule,
    IProcessor,
    IRecurringSchedule,
} from '../../definition/scheduler';
import { AppManager } from '../AppManager';
import { IAppSchedulerBridge } from '../bridges/IAppSchedulerBridge';

export class AppSchedulerManager {
    private readonly bridge: IAppSchedulerBridge;

    constructor(private readonly manager: AppManager) {
        this.bridge = this.manager.getBridges().getSchedulerBridge();
    }

    public registerProcessors(processors: Array<IProcessor> = [], appId: string): void {
        this.bridge.registerProcessors(processors,  appId);
    }

    public async scheduleOnce(job: IOnetimeSchedule, appId: string): Promise<void> {
        this.bridge.scheduleOnce(job, appId);
    }

    public async scheduleRecurring(job: IRecurringSchedule, appId: string): Promise<void> {
        this.bridge.scheduleRecurring(job, appId);
    }

    public async cancelJob(jobId: string, appId: string): Promise<void> {
        this.bridge.cancelJob(jobId, appId);
    }

    public async cancelAllJobs(appId: string): Promise<void> {
        this.bridge.cancelAllJobs(appId);
    }
}
