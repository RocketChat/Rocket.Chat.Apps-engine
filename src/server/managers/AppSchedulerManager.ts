import {
    IProcessor,
} from '../../definition/scheduler';
import { AppManager } from '../AppManager';
import { IAppSchedulerBridge } from '../bridges/IAppSchedulerBridge';

export class AppSchedulerManager {
    private readonly bridge: IAppSchedulerBridge;

    constructor(private readonly manager: AppManager) {
        this.bridge = this.manager.getBridges().getSchedulerBridge();
    }

    public registerProcessor(processor: IProcessor, appId: string): Promise<void> {
        this.bridge.registerProcessor(processor,  appId);
    }
}
