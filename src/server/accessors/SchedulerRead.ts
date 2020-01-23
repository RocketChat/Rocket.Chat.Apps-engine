import { ISchedulerRead } from '../../definition/accessors';
import { IJob } from '../../definition/scheduler';
import { IUser } from '../../definition/users';

export class SchedulerRead implements ISchedulerRead {
    constructor(private appId: string) { }

    public getJobs(): Promise<Array<IJob>> {
        console.log(`The app ${ this.appId } is getting all of their jobs`);
        throw new Error('Method not implemented.');
    }

    public getJobsByCreator(user: IUser): Promise<Array<IJob>> {
        throw new Error('Method not implemented.');
    }

    public getJobById(id: string): Promise<IJob> {
        throw new Error('Method not implemented.');
    }
}
