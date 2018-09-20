import { IApi } from '../../../src/definition/api';
import { IAppApiBridge } from '../../../src/server/bridges';
import { AppApi } from '../../../src/server/managers/AppApi';
import { TestData } from '../utilities';

export class TestsApiBridge implements IAppApiBridge {
    public apis: Map<string, Map<string, IApi>>;

    constructor() {
        this.apis = new Map<string, Map<string, IApi>>();
        this.apis.set('appId', new Map<string, IApi>());
        this.apis.get('appId').set('it-exists', TestData.getApi('it-exists'));
    }

    public registerApi(api: AppApi, appId: string): void {
        if (!this.apis.has(appId)) {
            this.apis.set(appId, new Map<string, IApi>());
        }

        if (this.apis.get(appId).has(api.api.path)) {
            throw new Error(`Api "${api.api.path}" has already been registered for app ${appId}.`);
        }

        this.apis.get(appId).set(api.api.path, api.api);
    }

    public unregisterApis(appId: string): void {
        this.apis.delete(appId);
    }
}
