import { IAppAccessors, IEnvironmentRead, IHttp, IRead } from '../../definition/accessors';
import { IApiEndpointMetadata } from '../../definition/api';
import { AppManager } from '../AppManager';
import { AppAccessorManager } from '../managers/AppAccessorManager';
import { AppApiManager } from '../managers/AppApiManager';
import { AppSlashCommandManager } from '../managers/AppSlashCommandManager';

export class AppAccessors implements IAppAccessors {
    private accessorManager: AppAccessorManager;
    private apiManager: AppApiManager;
    private slashcommandManager: AppSlashCommandManager;

    constructor(manager: AppManager, private readonly appId: string) {
        this.accessorManager = manager.getAccessorManager();
        this.apiManager = manager.getApiManager();
        this.slashcommandManager = manager.getCommandManager();
    }

    public getEnvironmentRead(): IEnvironmentRead {
        this.assertAppId();

        return this.accessorManager.getEnvironmentRead(this.appId);
    }

    public getReader(): IRead {
        this.assertAppId();

        return this.accessorManager.getReader(this.appId);
    }

    public getHttp(): IHttp {
        this.assertAppId();

        return this.accessorManager.getHttp(this.appId);
    }

    public getProvidedApiEndpoints(): Array<IApiEndpointMetadata> {
        this.assertAppId();

        return this.apiManager.listApis(this.appId);
    }

    public getSlashcommandManager() {
        return this.slashcommandManager;
    }

    private assertAppId(): void {
        if (!this.appId) {
            throw new Error(`appId is not set, can't provide accessors`);
        }
    }
}
