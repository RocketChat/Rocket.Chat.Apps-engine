import { ISchedulerExtend } from '../../definition/accessors';
import { IProcessor } from '../../definition/scheduler';
import { AppSchedulerManager } from '../managers/AppSchedulerManager';

export class SchedulerExtend implements ISchedulerExtend {
    constructor(private readonly manager: AppSchedulerManager, private readonly appId: string) {}

    public async registerProcessors(processors: Array<IProcessor> = []): Promise<void> {
        await this.manager.registerProcessors(processors, this.appId);
    }
}
