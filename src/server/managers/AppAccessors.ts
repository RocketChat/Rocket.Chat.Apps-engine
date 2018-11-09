import { IEnvironmentRead, IHttp, IRead } from '../../definition/accessors';
import { AppManager } from '../AppManager';
import { AppAccessorManager } from './AppAccessorManager';
import { AppApiManager } from './AppApiManager';
import { AppSlashCommandManager } from './AppSlashCommandManager';
import { AppApi } from './AppApi';
import { Utilities } from '../misc/Utilities';

export class AppAccessor {
    private accessorManager: AppAccessorManager;
    private apiManager: AppApiManager;
    private slashcommandManager: AppSlashCommandManager;
    private appId: string;

    constructor(manager: AppManager) {
        this.accessorManager = manager.getAccessorManager();
        this.apiManager = manager.getApiManager();
        this.slashcommandManager = manager.getCommandManager();
    }

    public setAppId(appId: string) {
        this.appId = appId;
    }

    public getEnvironmentRead(): IEnvironmentRead {
        this.assertAppId();

        return this.accessorManager.getEnvironmentRead(this.appId);
    }

    public getReader(): IRead {
        this.assertAppId();

        return this.accessorManager.getReader();
    }

    public getHttp(): IHttp {
        this.assertAppId();

        return this.accessorManager.getHttp();
    }

    public getProvidedApiEndpoints(): Map<string, AppApi> {
        this.assertAppId();

        return Utilities.deepClone(this.apiManager.getProvidedApis().get(this.appId));
    }
    public getProvidedSlashcommands(): Map<string, AppSlashCommand> {
        this.assertAppId();

        return Utilities.deepClone(this.slashcommandManager.getProvidedCommands().get(this.appId));
    }

    private assertAppId(): void {
        if (!this.appId) {
            throw new Error(`appId is not set, can't provide accessors`);
        }
    }
}
