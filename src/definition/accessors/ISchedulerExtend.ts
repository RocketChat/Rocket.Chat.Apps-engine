import { IProcessor } from '../scheduler';

export interface ISchedulerExtend {
    registerProcessors(processors: Array<IProcessor>): void;
}
