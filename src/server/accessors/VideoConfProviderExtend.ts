import { AppVideoConfProviderManager } from '../managers/AppVideoConfProviderManager';

import { IVideoConfProvidersExtend } from '../../definition/accessors';
import { IVideoConfProvider } from '../../definition/videoConfProviders';

export class VideoConfProviderExtend implements IVideoConfProvidersExtend {
    constructor(private readonly manager: AppVideoConfProviderManager, private readonly appId: string) { }

    public provideVideoConfProvider(provider: IVideoConfProvider): Promise<void> {
        return Promise.resolve(this.manager.addProvider(this.appId, provider));
    }
}
