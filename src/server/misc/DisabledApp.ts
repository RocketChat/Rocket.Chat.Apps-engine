import { ILogger } from '@rocket.chat/apps-ts-definition/accessors';
import { App } from '@rocket.chat/apps-ts-definition/App';
import { AppStatus } from '@rocket.chat/apps-ts-definition/AppStatus';
import { AppMethod, IAppInfo } from '@rocket.chat/apps-ts-definition/metadata';
import { AppConsole } from '../logging';

export class DisabledApp extends App {
    public static createNew(info: IAppInfo, status: AppStatus): DisabledApp {
        return new DisabledApp(info, new AppConsole(AppMethod._CONSTRUCTOR), status);
    }

    constructor(info: IAppInfo, logger: ILogger, status: AppStatus) {
        super(info, logger);
        this.setStatus(status);
    }

    public async onEnable(): Promise<boolean> {
        return false;
    }
}
