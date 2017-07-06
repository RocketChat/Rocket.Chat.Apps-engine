import { RocketletConsole } from './context/console';

export class RocketletLoggerManager {
    private loggers: Map<string, RocketletConsole>;

    constructor() {
        this.loggers = new Map<string, RocketletConsole>();
    }

    public retrieve(id: string): RocketletConsole {
        if (!this.loggers.has(id)) {
            this.loggers.set(id, new RocketletConsole());
        }

        return this.loggers.get(id);
    }

    public retrieveAll(): Map<string, RocketletConsole> {
        return this.loggers;
    }
}
