import { IAppAccessors, IEnvironmentRead, IHttp, IModify, IPersistence, IRead } from '../../definition/accessors';
import { IApiEndpointMetadata } from '../../definition/api';
import { AppManager } from '../AppManager';
import { AppAccessorManager } from '../managers/AppAccessorManager';
import { AppApiManager } from '../managers/AppApiManager';

export class AppAccessors implements IAppAccessors {
    private accessorManager: AppAccessorManager;
    private apiManager: AppApiManager;

    constructor(manager: AppManager, private readonly appId: string) {
        this.accessorManager = manager.getAccessorManager();
        this.apiManager = manager.getApiManager();
    }

    public get environmentReader(): IEnvironmentRead {
        return this.accessorManager.getEnvironmentRead(this.appId);
    }

    public get reader(): IRead {
        return this.accessorManager.getReader(this.appId);
    }

    public get http(): IHttp {
        return this.accessorManager.getHttp(this.appId);
    }

    public get modifier(): IModify {
        return this.accessorManager.getModifier(this.appId);
    }

    public get persistence(): IPersistence {
        return this.accessorManager.getPersistence(this.appId);
    }

    public get providedApiEndpoints(): Array<IApiEndpointMetadata> {
        try {
            return this.apiManager.listApis(this.appId);
        } catch (e) {
            return [];
        }
    }
}
