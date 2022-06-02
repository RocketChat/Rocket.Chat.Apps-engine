import type { IVideoConferenceUser } from '../../definition/videoConferences/IVideoConferenceUser';
import type { IVideoConferenceOptions, IVideoConfProvider, VideoConfData, VideoConfDataExtended } from '../../definition/videoConfProviders';
import { AppManager } from '../AppManager';
import { AVideoConfProviderAlreadyExistsError, NoVideoConfProviderRegisteredError } from '../errors';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissions } from '../permissions/AppPermissions';
import { AppAccessorManager } from './AppAccessorManager';
import { AppPermissionManager } from './AppPermissionManager';
import { AppVideoConfProvider } from './AppVideoConfProvider';

export class AppVideoConfProviderManager {
    private readonly accessors: AppAccessorManager;

    private videoConfProviders: Map<string, AppVideoConfProvider>;

    constructor(private readonly manager: AppManager) {
        this.accessors = this.manager.getAccessorManager();

        this.videoConfProviders = new Map<string, AppVideoConfProvider>();
    }
    public addProvider(appId: string, provider: IVideoConfProvider): void {
        const app = this.manager.getOneById(appId);
        if (!app) {
            throw new Error('App must exist in order for a video conference provider to be added.');
        }

        if (!AppPermissionManager.hasPermission(appId, AppPermissions.videoConfProvider.default)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.videoConfProvider.default],
            });
        }

        this.videoConfProviders.set(appId, new AppVideoConfProvider(app, provider));
    }

    public registerProviders(appId: string): void {
        if (!this.videoConfProviders.has(appId)) {
            return;
        }

        const providerInfo = this.videoConfProviders.get(appId);

        const registeredProviderInfo = this.retrieveRegisteredProvider();
        if (registeredProviderInfo && registeredProviderInfo !== providerInfo) {
            throw new AVideoConfProviderAlreadyExistsError();
        }

        providerInfo.hasBeenRegistered();
    }

    public unregisterProviders(appId: string): void {
        if (!this.videoConfProviders.has(appId)) {
            return;
        }

        this.videoConfProviders.get(appId).isRegistered = false;
    }

    public async generateUrl(call: VideoConfData): Promise<string> {
        const providerInfo = this.retrieveRegisteredProvider();
        if (!providerInfo) {
            throw new NoVideoConfProviderRegisteredError();
        }

        return providerInfo.runGenerateUrl(call, this.manager.getLogStorage(), this.accessors);
    }

    public async customizeUrl(call: VideoConfDataExtended, user?: IVideoConferenceUser, options?: IVideoConferenceOptions): Promise<string> {
        const providerInfo = this.retrieveRegisteredProvider();
        if (!providerInfo) {
            throw new NoVideoConfProviderRegisteredError();
        }

        return providerInfo.runCustomizeUrl(call, user, options, this.manager.getLogStorage(), this.accessors);
    }

    private retrieveRegisteredProvider(): AppVideoConfProvider | undefined {
        for (const [, provider] of this.videoConfProviders) {
            if (provider.isRegistered) {
                return provider;
            }
        }
    }
}
