import { ISchedulerExtend } from '../../definition/accessors';
import { IJob, Schedule } from '../../definition/scheduler';

export class SchedulerExtend implements ISchedulerExtend {
    constructor(private appId: string) { }

    public scheduleJob(job: IJob, schedule: Schedule): Promise<string> {
        console.log(`The app ${ this.appId } is scheduling the "${ job.name }" job:`, job, 'Schedule:', schedule);
        throw new Error('Method not implemented.');
    }
}
