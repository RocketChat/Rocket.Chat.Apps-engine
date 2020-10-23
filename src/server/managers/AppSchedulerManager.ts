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

    public registerProcessor(processor: IProcessor, appId: string): void {
        this.bridge.registerProcessor(processor,  appId);
    }

    public async scheduleOnce(job: IOnetimeSchedule, appId: string): Promise<void> {
        this.bridge.scheduleOnce(job, appId);
    }

    public async scheduleRecurring(job: IRecurringSchedule, appId: string): Promise<void> {
        this.bridge.scheduleRecurring(job, appId);
    }

    public async cancelScheduledJob(jobId: string, appId: string): Promise<void> {
        this.bridge.cancelScheduledJob(jobId, appId);
    }
}
