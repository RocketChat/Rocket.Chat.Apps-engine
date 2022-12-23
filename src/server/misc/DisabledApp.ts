import type { ILogger } from '../../definition/accessors';
import { App } from '../../definition/App';
import type { AppStatus } from '../../definition/AppStatus';
import type { IAppInfo } from '../../definition/metadata';
import { AppMethod } from '../../definition/metadata';
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

	public getLogger(): AppConsole {
		return super.getLogger() as AppConsole;
	}
}
