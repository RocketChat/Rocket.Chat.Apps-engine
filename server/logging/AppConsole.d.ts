import { ILogEntry, ILogger } from '../../definition/accessors';
import { AppMethod } from '../../definition/metadata';
import { ILoggerStorageEntry } from './ILoggerStorageEntry';
export declare class AppConsole implements ILogger {
    static toStorageEntry(appId: string, logger: AppConsole): ILoggerStorageEntry;
    method: AppMethod;
    private entries;
    private start;
    constructor(method: AppMethod);
    debug(...items: Array<any>): void;
    info(...items: Array<any>): void;
    log(...items: Array<any>): void;
    warn(...items: Array<any>): void;
    error(...items: Array<any>): void;
    success(...items: Array<any>): void;
    getEntries(): Array<ILogEntry>;
    getMethod(): AppMethod;
    getStartTime(): Date;
    getEndTime(): Date;
    getTotalTime(): number;
    private addEntry(severity, caller, ...items);
    private getFunc(stack);
}
