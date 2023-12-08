// deno-lint-ignore-file no-explicit-any
import * as stackTrace from 'npm:stack-trace'
import { StackFrame } from 'npm:stack-trace'

enum LogMessageSeverity {
    DEBUG = 'debug',
    INFORMATION = 'info',
    LOG = 'log',
    WARNING = 'warning',
    ERROR = 'error',
    SUCCESS = 'success',
}

type Entry = {
    caller: string;
    severity: LogMessageSeverity;
    method: string;
    timestamp: Date;
    args: Array<any>;
}

interface ILoggerStorageEntry {
    appId: string;
    method: string;
    entries: Array<Entry>;
    startTime: Date;
    endTime: Date;
    totalTime: number;
    _createdAt: Date;
}

export class Logger {
    private appId: string;
    private entries: Array<Entry>;
    private start: Date;
    private method: string;

    constructor(method: string, appId: string) {
        this.appId = appId;
        this.method = method;
        this.entries = [];
        this.start = new Date();
    }

    public debug(...args: Array<any>): void {
        this.addEntry(LogMessageSeverity.DEBUG, this.getStack(stackTrace.get()), ...args)
    }

    public info(...args: Array<any>): void {
        this.addEntry(LogMessageSeverity.INFORMATION, this.getStack(stackTrace.get()), ...args)
    }

    public log(...args: Array<any>): void {
        this.addEntry(LogMessageSeverity.LOG, this.getStack(stackTrace.get()), ...args)
    }

    public warning(...args: Array<any>): void {
        this.addEntry(LogMessageSeverity.WARNING, this.getStack(stackTrace.get()), ...args)
    }

    public error(...args: Array<any>): void {
        this.addEntry(LogMessageSeverity.ERROR, this.getStack(stackTrace.get()), ...args)
    }

    public success(...args: Array<any>): void {
        this.addEntry(LogMessageSeverity.SUCCESS, this.getStack(stackTrace.get()), ...args)
    }

    private addEntry(severity: LogMessageSeverity, caller: string,...items: Array<any>): void {
        const i = items.map((v) => {
            if (v instanceof Error) {
                return JSON.stringify(v, Object.getOwnPropertyNames(v));
            }
            if (typeof v === 'object' && typeof v.stack === 'string' && typeof v.message === 'string') {
                return JSON.stringify(v, Object.getOwnPropertyNames(v));
            }
            const str = JSON.stringify(v, null, 2);
            return str ? JSON.parse(str) : str; // force call toJSON to prevent circular references
        });

        this.entries.push({
            caller,
            severity,
            method: this.method,
            timestamp: new Date(),
            args: i,
        });
    }

    private getStack(stack: Array<StackFrame>): string {
        let func = 'anonymous';

        if (stack.length === 1) {
            return func;
        }

        const frame = stack[1];

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

    private getTotalTime(): number {
        return new Date().getTime() - this.start.getTime();
    }

    public getLogs(): ILoggerStorageEntry {
        return {
            appId: this.appId,
            method: this.method,
            entries: this.entries,
            startTime: this.start,
            endTime: new Date(),
            totalTime: this.getTotalTime(),
            _createdAt: new Date(),
        };
    }
}
