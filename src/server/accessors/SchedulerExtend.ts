import { ISchedulerExtend } from '../../definition/accessors';
import { IJobBuilder } from '../../definition/accessors/IJobBuilder';
import { IJob } from '../../definition/scheduler';

export class SchedulerExtend implements ISchedulerExtend {
    constructor(private appId: string) { }

    public scheduleJob(job: IJob): Promise<void> {
        console.log(`The app ${ this.appId } is scheduling a job: ${ job.name }`, job);
        throw new Error('Method not implemented.');
    }

    public getJobBuilder(job?: IJob): IJobBuilder {
        throw new Error('Method not implemented.');
    }
}
