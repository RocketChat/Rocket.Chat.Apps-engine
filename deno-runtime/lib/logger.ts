import * as stackTrace from 'npm:stack-trace'

enum LogMessageSeverity {
    DEBUG = 'debug',
    INFORMATION = 'info',
    LOG = 'log',
    WARNING = 'warning',
    ERROR = 'error',
    SUCCESS = 'success',
}

export class Logger {
    private static instance: Logger;
    private entries: Array<object> = [];
    public method = '';

    private constructor() {}

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }

        return Logger.instance;
    }

    public debug(...args: Array<any>) {
        this.addEntry(LogMessageSeverity.DEBUG, this.getStack(stackTrace.get()), ...args)
    }

    public info(...args: Array<any>){
        this.addEntry(LogMessageSeverity.INFORMATION, this.getStack(stackTrace.get()), ...args)
    }

    public log(...args: Array<any>){
        this.addEntry(LogMessageSeverity.LOG, this.getStack(stackTrace.get()), ...args)
    }

    public warning(...args: Array<any>){
        this.addEntry(LogMessageSeverity.WARNING, this.getStack(stackTrace.get()), ...args)
    }

    public error(...args: Array<any>){
        this.addEntry(LogMessageSeverity.ERROR, this.getStack(stackTrace.get()), ...args)
    }

    public success(...args: Array<any>){
        this.addEntry(LogMessageSeverity.SUCCESS, this.getStack(stackTrace.get()), ...args)
    }

    private addEntry(severity: LogMessageSeverity, caller?: string,...items: Array<any>) {
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

    private getStack(stack: Array<any>) {
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

    public flush() {
        const logs = this.entries;
        this.entries = [];
        this.method = '';
        return logs;
    }
}
