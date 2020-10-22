import { IProcessor } from '../../definition/scheduler';

export interface IAppSchedulerBridge {
    registerProcessor(info: IProcessor, appId: string): Promise<void>;
}
