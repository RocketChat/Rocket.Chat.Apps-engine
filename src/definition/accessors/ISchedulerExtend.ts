import { IProcessor } from '../scheduler';

export interface ISchedulerExtend {
    registerProcessor(descriptor: IProcessor): void;
}