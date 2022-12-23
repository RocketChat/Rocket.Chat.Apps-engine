import { AppMethod } from '../../definition/metadata';
import type { IBlock } from '../../definition/uikit';
import type { VideoConference } from '../../definition/videoConferences';
import type { IVideoConferenceUser } from '../../definition/videoConferences/IVideoConferenceUser';
import type {
	IVideoConferenceOptions,
	IVideoConfProvider,
	VideoConfData,
	VideoConfDataExtended,
} from '../../definition/videoConfProviders';
import type { ProxiedApp } from '../ProxiedApp';
import type { AppLogStorage } from '../storage';
import type { AppAccessorManager } from './AppAccessorManager';

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

	public async runIsFullyConfigured(logStorage: AppLogStorage, accessors: AppAccessorManager): Promise<boolean> {
		if (typeof this.provider[AppMethod._VIDEOCONF_IS_CONFIGURED] !== 'function') {
			return true;
		}

		return !!(await this.runTheCode(AppMethod._VIDEOCONF_IS_CONFIGURED, logStorage, accessors, [])) as boolean;
	}

	public async runGenerateUrl(call: VideoConfData, logStorage: AppLogStorage, accessors: AppAccessorManager): Promise<string> {
		return (await this.runTheCode(AppMethod._VIDEOCONF_GENERATE_URL, logStorage, accessors, [call])) as string;
	}

	public async runCustomizeUrl(
		call: VideoConfDataExtended,
		user: IVideoConferenceUser | undefined,
		options: IVideoConferenceOptions = {},
		logStorage: AppLogStorage,
		accessors: AppAccessorManager,
	): Promise<string> {
		return (await this.runTheCode(AppMethod._VIDEOCONF_CUSTOMIZE_URL, logStorage, accessors, [call, user, options])) as string;
	}

	public async runOnNewVideoConference(call: VideoConference, logStorage: AppLogStorage, accessors: AppAccessorManager): Promise<void> {
		await this.runTheCode(AppMethod._VIDEOCONF_NEW, logStorage, accessors, [call]);
	}

	public async runOnVideoConferenceChanged(
		call: VideoConference,
		logStorage: AppLogStorage,
		accessors: AppAccessorManager,
	): Promise<void> {
		await this.runTheCode(AppMethod._VIDEOCONF_CHANGED, logStorage, accessors, [call]);
	}

	public async runOnUserJoin(
		call: VideoConference,
		user: IVideoConferenceUser | undefined,
		logStorage: AppLogStorage,
		accessors: AppAccessorManager,
	): Promise<void> {
		await this.runTheCode(AppMethod._VIDEOCONF_USER_JOINED, logStorage, accessors, [call, user]);
	}

	public async runGetVideoConferenceInfo(
		call: VideoConference,
		user: IVideoConferenceUser | undefined,
		logStorage: AppLogStorage,
		accessors: AppAccessorManager,
	): Promise<Array<IBlock> | undefined> {
		return (await this.runTheCode(AppMethod._VIDEOCONF_GET_INFO, logStorage, accessors, [call, user])) as Array<IBlock> | undefined;
	}

	private async runTheCode(
		method:
			| AppMethod._VIDEOCONF_GENERATE_URL
			| AppMethod._VIDEOCONF_CUSTOMIZE_URL
			| AppMethod._VIDEOCONF_IS_CONFIGURED
			| AppMethod._VIDEOCONF_NEW
			| AppMethod._VIDEOCONF_CHANGED
			| AppMethod._VIDEOCONF_GET_INFO
			| AppMethod._VIDEOCONF_USER_JOINED,
		logStorage: AppLogStorage,
		accessors: AppAccessorManager,
		runContextArgs: Array<any>,
	): Promise<string | boolean | Array<IBlock> | undefined> {
		// Ensure the provider has the property before going on
		if (typeof this.provider[method] !== 'function') {
			return;
		}

		const runContext = {
			provider: this.provider,
			args: [
				...runContextArgs,
				accessors.getReader(this.app.getID()),
				accessors.getModifier(this.app.getID()),
				accessors.getHttp(this.app.getID()),
				accessors.getPersistence(this.app.getID()),
			],
		};

		const logger = this.app.setupLogger(method);
		logger.debug(`Executing ${method} on video conference provider...`);

		let result: string | undefined;
		try {
			const runCode = `module.exports = provider.${method}.apply(provider, args)`;
			result = await this.app.getRuntime().runInSandbox(runCode, runContext);
			logger.debug(`Video Conference Provider's ${method} was successfully executed.`);
		} catch (e) {
			logger.error(e);
			logger.debug(`Video Conference Provider's ${method} was unsuccessful.`);
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
