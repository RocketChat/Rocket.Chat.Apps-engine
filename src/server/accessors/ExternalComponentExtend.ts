import { AppExternalComponentManager } from '../managers/AppExternalComponentManager';

import { IExternalComponentExtend } from '../../definition/accessors';
import { IExternalComponent } from '../../definition/externalComponent/IExternalComponent';

export class ExternalComponentExtend implements IExternalComponentExtend {
    constructor(private readonly manager: AppExternalComponentManager, private readonly appId: string) { }

    public async register(externalComponent: IExternalComponent): Promise<void> {
        return Promise.resolve(this.manager.registerComponent(this.appId, externalComponent));
    }
}
