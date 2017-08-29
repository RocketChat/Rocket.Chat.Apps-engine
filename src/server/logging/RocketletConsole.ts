import * as stackTrace from 'stack-trace';
import { ILogEntry, ILogger, LogMessageSeverity } from 'temporary-rocketlets-ts-definition/accessors';

export class RocketletConsole implements ILogger {
    public debugEntries: Array<ILogEntry>;
    public infoEntries: Array<ILogEntry>;
    public logEntries: Array<ILogEntry>;
    public warnEntries: Array<ILogEntry>;
    public errorEntries: Array<ILogEntry>;
    public successEntries: Array<ILogEntry>;

    constructor() {
        this.debugEntries = new Array<ILogEntry>();
        this.infoEntries = new Array<ILogEntry>();
        this.logEntries = new Array<ILogEntry>();
        this.warnEntries = new Array<ILogEntry>();
        this.errorEntries = new Array<ILogEntry>();
        this.successEntries = new Array<ILogEntry>();
    }

    public debug(...items: Array<any>): void {
        this.debugEntries.push({
            caller: this.getFunc(stackTrace.get()),
            severity: LogMessageSeverity.DEBUG,
            timestamp: new Date(),
            args: items,
        });
    }

    public info(...items: Array<any>): void {
        this.infoEntries.push({
            caller: this.getFunc(stackTrace.get()),
            severity: LogMessageSeverity.INFORMATION,
            timestamp: new Date(),
            args: items,
        });
    }

    public log(...items: Array<any>): void {
        this.logEntries.push({
            caller: this.getFunc(stackTrace.get()),
            severity: LogMessageSeverity.LOG,
            timestamp: new Date(),
            args: items,
        });
    }

    public warn(...items: Array<any>): void {
        this.warnEntries.push({
            caller: this.getFunc(stackTrace.get()),
            severity: LogMessageSeverity.WARNING,
            timestamp: new Date(),
            args: items,
        });
    }

    public error(...items: Array<any>): void {
        this.errorEntries.push({
            caller: this.getFunc(stackTrace.get()),
            severity: LogMessageSeverity.ERROR,
            timestamp: new Date(),
            args: items,
        });
    }

    public success(...items: Array<any>): void {
        this.successEntries.push({
            caller: this.getFunc(stackTrace.get()),
            severity: LogMessageSeverity.SUCCESS,
            timestamp: new Date(),
            args: items,
        });
    }

    public getAllEntries(): Array<ILogEntry> {
        return this.debugEntries.concat(this.infoEntries)
                    .concat(this.logEntries)
                    .concat(this.warnEntries)
                    .concat(this.errorEntries)
                    .concat(this.successEntries);
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
