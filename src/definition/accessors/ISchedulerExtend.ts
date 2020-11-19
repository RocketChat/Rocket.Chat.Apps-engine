import { IProcessor } from '../scheduler';

export interface ISchedulerExtend {
    /**
     * Register processors that can be scheduled to run
     *
     * @param {Array<IProcessor>} processors An array of processors
     */
    registerProcessors(processors: Array<IProcessor>): Promise<void>;
}
