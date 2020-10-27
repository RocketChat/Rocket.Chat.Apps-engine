import { IApiExtend } from '../../definition/accessors';
import { IApi } from '../../definition/api';
import { AppApiManager } from '../managers/AppApiManager';

export class ApiExtend implements IApiExtend {
    constructor(private readonly manager: AppApiManager, private readonly appId: string) {}

    public provideApi(api: IApi): Promise<void> {
        return Promise.resolve(this.manager.addApi(this.appId, api));
    }
}
