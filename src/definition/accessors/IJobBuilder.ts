import { RecurrenceBuilder } from 'later';

import { IJob, IJobResult, Schedule } from '../scheduler';
import { IHttp } from './IHttp';
import { IModify } from './IModify';
import { IPersistence } from './IPersistence';
import { IRead } from './IRead';

export interface IJobBuilder {
    setName(name: string): IJobBuilder;
    getName(): string;
    setDescription(description: string): IJobBuilder;
    getDescription(): string;
    setData(data: { [key: string]: any }): IJobBuilder;
    getData(): { [key: string]: any };
    parseTextSchedule(textToParse: string): IJobBuilder;
    parseCronSchedule(cronToParse: string, includesSeconds?: boolean): IJobBuilder;
    getRecurrenceScheduleBuilder(): RecurrenceBuilder;
    setSchedule(schedule: Schedule): IJobBuilder;
    getSchedule(): Schedule;
    setExecutor(executor: (job: IJob, read: IRead, modify: IModify, http: IHttp, persis: IPersistence) => Promise<IJobResult>): IJobBuilder;
    getJob(): IJob;
}
