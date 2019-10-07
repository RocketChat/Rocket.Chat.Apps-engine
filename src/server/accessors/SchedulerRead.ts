import { ISchedulerRead } from '../../definition/accessors';
import { IJob } from '../../definition/scheduler';

export class SchedulerRead implements ISchedulerRead {
    constructor(private appId: string) { }

    public getJobs(): Promise<Array<IJob>> {
        console.log(`The app ${ this.appId } is getting all of their jobs`);
        throw new Error('Method not implemented.');
    }
}
