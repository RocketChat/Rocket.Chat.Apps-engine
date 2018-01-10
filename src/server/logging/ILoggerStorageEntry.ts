import { ILogEntry } from '@rocket.chat/apps-ts-definition/accessors';
import { AppMethod } from '@rocket.chat/apps-ts-definition/metadata';

export interface ILoggerStorageEntry {
    appId: string;
    method: AppMethod;
    entries: Array<ILogEntry>;
    startTime: Date;
    endTime: Date;
    totalTime: number;
    // Internal value to be used for sorting
    _createdAt: Date;
}
