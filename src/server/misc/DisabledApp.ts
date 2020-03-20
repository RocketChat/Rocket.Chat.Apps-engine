import { ILogger } from '../../definition/accessors';
import { App } from '../../definition/App';
import { AppStatus } from '../../definition/AppStatus';
import { IAppInfo } from '../../definition/metadata';
import { AppConsole } from '../logging';

export class DisabledApp extends App {
    public static createNew(info: IAppInfo, status: AppStatus, logger: AppConsole): DisabledApp {
        return new DisabledApp(info, logger, status);
    }

    constructor(info: IAppInfo, logger: ILogger, status: AppStatus) {
        super(info, logger);
        this.setStatus(status);
    }

    public async onEnable(): Promise<boolean> {
        return false;
    }

    public getLogger(): AppConsole {
        return super.getLogger() as AppConsole;
    }
}
