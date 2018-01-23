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
        this.addEntry(LogMessageSeverity.DEBUG, this.getFunc(stackTrace.get()), ...items);
    }

    public info(...items: Array<any>): void {
        this.addEntry(LogMessageSeverity.INFORMATION, this.getFunc(stackTrace.get()), ...items);
    }

    public log(...items: Array<any>): void {
        this.addEntry(LogMessageSeverity.LOG, this.getFunc(stackTrace.get()), ...items);
    }

    public warn(...items: Array<any>): void {
        this.addEntry(LogMessageSeverity.WARNING, this.getFunc(stackTrace.get()), ...items);
    }

    public error(...items: Array<any>): void {
        this.addEntry(LogMessageSeverity.ERROR, this.getFunc(stackTrace.get()), ...items);
    }

    public success(...items: Array<any>): void {
        this.addEntry(LogMessageSeverity.SUCCESS, this.getFunc(stackTrace.get()), ...items);
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

    private addEntry(severity: LogMessageSeverity, caller: string, ...items: Array<any>): void {
        const i = items.map((v) => {
            if (v instanceof Error) {
                return JSON.stringify(v, Object.getOwnPropertyNames(v));
            } else {
                return v;
            }
        });

        this.entries.push({
            caller,
            severity,
            timestamp: new Date(),
            args: i,
        });

        // This should be a setting? :thinking:
        console.log(`${ severity.toUpperCase() }:`, ...i);
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
