import { AppMethod } from '../../definition/metadata';
import { IVideoConferenceUser } from '../../definition/videoConferences/IVideoConferenceUser';
import type { IVideoConferenceOptions, IVideoConfProvider, VideoConfData, VideoConfDataExtended } from '../../definition/videoConfProviders';

import { ProxiedApp } from '../ProxiedApp';
import { AppLogStorage } from '../storage';
import { AppAccessorManager } from './AppAccessorManager';

export class AppVideoConfProvider {
    /**
     * States whether this provider has been registered into the Rocket.Chat system or not.
     */
    public isRegistered: boolean;

    constructor(public app: ProxiedApp, public provider: IVideoConfProvider) {
        this.isRegistered = false;
    }

    public hasBeenRegistered(): void {
        this.isRegistered = true;
    }

    public canBeRan(method: AppMethod): boolean {
        return this.app.hasMethod(method);
    }

    public async runGenerateUrl(
      call: VideoConfData,
      logStorage: AppLogStorage,
      accessors: AppAccessorManager,
    ): Promise<string> {
        return await this.runTheCode(AppMethod._VIDEOCONF_GENERATE_URL, logStorage, accessors, [call]);
    }

    public async runCustomizeUrl(
      call: VideoConfDataExtended,
      user: IVideoConferenceUser | undefined,
      options: IVideoConferenceOptions = {},
      logStorage: AppLogStorage,
      accessors: AppAccessorManager,
    ): Promise<string> {
        return await this.runTheCode(AppMethod._VIDEOCONF_CUSTOMIZE_URL, logStorage, accessors, [call, user, options]);
    }

    private async runTheCode(
      method: AppMethod._VIDEOCONF_GENERATE_URL | AppMethod._VIDEOCONF_CUSTOMIZE_URL,
      logStorage: AppLogStorage,
      accessors: AppAccessorManager,
      runContextArgs: Array<any>,
    ): Promise<string | undefined> {
        // Ensure the provider has the property before going on
        if (typeof this.provider[method] !== 'function') {
            return;
        }

        const logger = this.app.setupLogger(method);
        logger.debug(`Executing ${ method } on video conference provider...`);

        try {
            const runCode = `provider.${ method }.apply(provider, args)`;
            const result = await this.app.getRuntime().runInSandbox(runCode, {
                provider: this.provider,
                args: [
                    ...runContextArgs,
                    accessors.getReader(this.app.getID()),
                    accessors.getModifier(this.app.getID()),
                    accessors.getHttp(this.app.getID()),
                    accessors.getPersistence(this.app.getID()),
                ],
            });

            logger.debug(`Video Conference Provider's ${ method } was successfully executed.`);
            return result;
        } catch (e) {
            logger.error(e);
            logger.debug(`Video Conference Provider's ${ method } was unsuccessful.`);
        } finally {
            await logStorage.storeEntries(this.app.getID(), logger);
        }
    }
}
