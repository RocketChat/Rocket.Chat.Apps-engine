import { IAppAccessors, IEnvironmentRead, IHttp, INet, IRead } from '../../definition/accessors';
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

    public get providedApiEndpoints(): Array<IApiEndpointMetadata> {
        return this.apiManager.listApis(this.appId);
    }

    public get net(): INet {
        return this.accessorManager.getNet(this.appId);
    }
}
