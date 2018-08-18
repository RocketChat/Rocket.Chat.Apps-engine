import { ILogger } from '../../definition/accessors';
import { App } from '../../definition/App';
import { AppStatus } from '../../definition/AppStatus';
import { IAppInfo } from '../../definition/metadata';
import { AppConsole } from '../logging';
export declare class DisabledApp extends App {
    static createNew(info: IAppInfo, status: AppStatus): DisabledApp;
    constructor(info: IAppInfo, logger: ILogger, status: AppStatus);
    onEnable(): Promise<boolean>;
    getLogger(): AppConsole;
}
