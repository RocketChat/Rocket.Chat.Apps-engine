import { ISchedulerExtend } from '../../definition/accessors';
import { IProcessor } from '../../definition/scheduler';
import { AppSchedulerManager } from '../managers/AppSchedulerManager';

export class SchedulerExtend implements ISchedulerExtend {
    constructor(private readonly manager: AppSchedulerManager, private readonly appId: string) {}

    public registerProcessors(processors: Array<IProcessor> = []): void {
        this.manager.registerProcessors(processors, this.appId);
    }
}
