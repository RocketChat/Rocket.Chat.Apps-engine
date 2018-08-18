import { ILogEntry } from '../../definition/accessors';
import { AppMethod } from '../../definition/metadata';
export interface ILoggerStorageEntry {
    appId: string;
    method: AppMethod;
    entries: Array<ILogEntry>;
    startTime: Date;
    endTime: Date;
    totalTime: number;
    _createdAt: Date;
}
