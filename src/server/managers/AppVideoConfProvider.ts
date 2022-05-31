import { AppMethod } from '../../definition/metadata';
import type { INewVideoConference, IVideoConference, IVideoConferenceOptions, IVideoConferenceUser, IVideoConfProvider } from '../../definition/videoConfProviders';

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
      call: INewVideoConference,
      logStorage: AppLogStorage,
      accessors: AppAccessorManager,
    ): Promise<string> {
        return await this.runTheCode(AppMethod._VIDEOCONF_GENERATE_URL, logStorage, accessors, [call]);
    }

    public async runCustomizeUrl(
      call: IVideoConference,
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

        const runContext = this.app.makeContext({
            provider: this.provider,
            args: [
                ...runContextArgs,
                accessors.getReader(this.app.getID()),
                accessors.getModifier(this.app.getID()),
                accessors.getHttp(this.app.getID()),
                accessors.getPersistence(this.app.getID()),
            ],
        });

        const logger = this.app.setupLogger(method);
        logger.debug(`Executing ${ method } on video conference provider...`);

        let result: string | undefined;
        try {
            const runCode = `provider.${ method }.apply(provider, args)`;
            result = await this.app.runInContext(runCode, runContext);
            logger.debug(`Video Conference Provider's ${ method } was successfully executed.`);
        } catch (e) {
            logger.error(e);
            logger.debug(`Video Conference Provider's ${ method } was unsuccessful.`);
        }

        try {
            await logStorage.storeEntries(this.app.getID(), logger);
        } catch (e) {
            // Don't care, at the moment.
            // TODO: Evaluate to determine if we do care
        }

        return result;
    }
}
