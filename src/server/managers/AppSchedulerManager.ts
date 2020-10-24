import {
    IOnetimeSchedule,
    IProcessor,
    IRecurringSchedule,
} from '../../definition/scheduler';
import { AppManager } from '../AppManager';
import { IAppSchedulerBridge } from '../bridges/IAppSchedulerBridge';
import { AppAccessorManager } from './';

function createProcessorId(jobId, appId) {
	return `${ jobId }_${ appId }`;
}

export class AppSchedulerManager {
    private readonly bridge: IAppSchedulerBridge;
    private readonly accessors: AppAccessorManager;

    private registeredProcessors: Map<string, {[processorId: string]: IProcessor}>;

    constructor(private readonly manager: AppManager) {
        this.bridge = this.manager.getBridges().getSchedulerBridge();
        this.accessors = this.manager.getAccessorManager();
    }

    public registerProcessors(processors: Array<IProcessor> = [], appId: string): void {
        const processorId = createProcessorId(processor.id, appId);

        if (!this.registeredProcessors.get(appId)) {
            this.registeredProcessors.set(appId, {});
        }

        this.registeredProcessors.get(appId)[processorId] = processor;

        this.bridge.registerProcessor({ ...processor, id: processorId },  appId);
    }

    public async callProcessor(processorId: string, data: object): Promise<void> {

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
