import { AppConsole } from '../logging';

export class AppLoggerManager {
    private loggers: Map<string, AppConsole>;

    constructor() {
        this.loggers = new Map<string, AppConsole>();
    }

    public retrieve(id: string): AppConsole {
        if (!this.loggers.has(id)) {
            this.loggers.set(id, new AppConsole());
        }

        return this.loggers.get(id);
    }

    public retrieveAll(): Map<string, AppConsole> {
        return this.loggers;
    }
}
