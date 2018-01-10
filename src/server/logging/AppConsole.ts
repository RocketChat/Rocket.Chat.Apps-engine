import * as stackTrace from 'stack-trace';

import { ILogEntry, ILogger, LogMessageSeverity } from '@rocket.chat/apps-ts-definition/accessors';
import { AppMethod } from '@rocket.chat/apps-ts-definition/metadata';
import { ILoggerStorageEntry } from './ILoggerStorageEntry';

export class AppConsole implements ILogger {
    public static toStorageEntry(appId: string, logger: AppConsole): ILoggerStorageEntry {
        return {
            appId,
            method: logger.getMethod(),
            entries: logger.getEntries(),
            startTime: logger.getStartTime(),
            endTime: logger.getEndTime(),
            totalTime: logger.getTotalTime(),
            _createdAt: new Date(),
        };
    }

    public method: AppMethod;
    private entries: Array<ILogEntry>;
    private start: Date;

    constructor(method: AppMethod) {
        this.method = method;
        this.entries = new Array<ILogEntry>();
        this.start = new Date();
    }

    public debug(...items: Array<any>): void {
        this.entries.push({
            caller: this.getFunc(stackTrace.get()),
            severity: LogMessageSeverity.DEBUG,
            timestamp: new Date(),
            args: items,
        });

        console.debug(items);
    }

    public info(...items: Array<any>): void {
        this.entries.push({
            caller: this.getFunc(stackTrace.get()),
            severity: LogMessageSeverity.INFORMATION,
            timestamp: new Date(),
            args: items,
        });

        console.info(items);
    }

    public log(...items: Array<any>): void {
        this.entries.push({
            caller: this.getFunc(stackTrace.get()),
            severity: LogMessageSeverity.LOG,
            timestamp: new Date(),
            args: items,
        });

        console.log(items);
    }

    public warn(...items: Array<any>): void {
        this.entries.push({
            caller: this.getFunc(stackTrace.get()),
            severity: LogMessageSeverity.WARNING,
            timestamp: new Date(),
            args: items,
        });

        console.warn(items);
    }

    public error(...items: Array<any>): void {
        this.entries.push({
            caller: this.getFunc(stackTrace.get()),
            severity: LogMessageSeverity.ERROR,
            timestamp: new Date(),
            args: items,
        });

        console.error(items);
    }

    public success(...items: Array<any>): void {
        this.entries.push({
            caller: this.getFunc(stackTrace.get()),
            severity: LogMessageSeverity.SUCCESS,
            timestamp: new Date(),
            args: items,
        });

        console.log('[SUCCESS]:', ...items);
    }

    public getEntries(): Array<ILogEntry> {
        return Array.from(this.entries);
    }

    public getMethod(): AppMethod {
        return this.method;
    }

    public getStartTime(): Date {
        return this.start;
    }

    public getEndTime(): Date {
        return new Date();
    }

    public getTotalTime(): number {
        return this.getEndTime().getTime() - this.getStartTime().getTime();
    }

    private getFunc(stack: Array<stackTrace.StackFrame>): string {
        let func: string = 'anonymous';

        if (stack.length === 1) {
            return func;
        }

        const frame: stackTrace.StackFrame = stack[1];

        if (frame.getMethodName() === null) {
            func = 'anonymous OR constructor';
        } else {
            func = frame.getMethodName();
        }

        if (frame.getFunctionName() !== null) {
            func = `${func} -> ${frame.getFunctionName()}`;
        }

        return func;
    }
}
