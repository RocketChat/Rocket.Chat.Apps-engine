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

    private constructor() {}

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }

        return Logger.instance;
    }

    public debug(...args: Array<any>) {
        this.addEntry(LogMessageSeverity.DEBUG, ...args)
    }

    public info(...args: Array<any>){
        this.addEntry(LogMessageSeverity.INFORMATION, ...args)
    }

    public log(...args: Array<any>){
        this.addEntry(LogMessageSeverity.LOG, ...args)
    }

    public warning(...args: Array<any>){
        this.addEntry(LogMessageSeverity.WARNING, ...args)
    }

    public error(...args: Array<any>){
        this.addEntry(LogMessageSeverity.ERROR, ...args)
    }

    public success(...args: Array<any>){
        this.addEntry(LogMessageSeverity.SUCCESS, ...args)
    }

    private addEntry(severity: LogMessageSeverity,...items: Array<any>) {
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
            severity,
            timestamp: new Date(),
            args: i,
        });
    }

    public flush() {
        const logs = this.entries;
        this.entries = [];
        return logs;
    }
}
