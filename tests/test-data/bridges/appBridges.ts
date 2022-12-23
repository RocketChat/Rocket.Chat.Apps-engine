import type {
	AppActivationBridge,
	AppDetailChangesBridge,
	EnvironmentalVariableBridge,
	HttpBridge,
	IInternalBridge,
	IListenerBridge,
	LivechatBridge,
	MessageBridge,
	PersistenceBridge,
	RoomBridge,
	SchedulerBridge,
	ServerSettingBridge,
	UiInteractionBridge,
	UploadBridge,
	UserBridge,
	VideoConferenceBridge,
} from '../../../src/server/bridges';
import { AppBridges } from '../../../src/server/bridges';
import type { CloudWorkspaceBridge } from '../../../src/server/bridges/CloudWorkspaceBridge';
import type { OAuthAppsBridge } from '../../../src/server/bridges/OAuthAppsBridge';
import { TestsActivationBridge } from './activationBridge';
import { TestsApiBridge } from './apiBridge';
import { TestsAppDetailChangesBridge } from './appDetailChanges';
import { TestAppCloudWorkspaceBridge } from './cloudBridge';
import { TestsCommandBridge } from './commandBridge';
import { TestsEnvironmentalVariableBridge } from './environmentalVariableBridge';
import { TestsHttpBridge } from './httpBridge';
import { TestsInternalBridge } from './internalBridge';
import { TestLivechatBridge } from './livechatBridge';
import { TestsMessageBridge } from './messageBridge';
import { TestOAuthAppsBridge } from './OAuthAppsBridge';
import { TestsPersisBridge } from './persisBridge';
import { TestsRoomBridge } from './roomBridge';
import { TestSchedulerBridge } from './schedulerBridge';
import { TestsServerSettingBridge } from './serverSettingBridge';
import { TestsUiIntegrationBridge } from './uiIntegrationBridge';
import { TestUploadBridge } from './uploadBridge';
import { TestsUserBridge } from './userBridge';
import { TestsVideoConferenceBridge } from './videoConferenceBridge';

export class TestsAppBridges extends AppBridges {
	private readonly appDetails: TestsAppDetailChangesBridge;

	private readonly cmdBridge: TestsCommandBridge;

	private readonly apiBridge: TestsApiBridge;

	private readonly setsBridge: TestsServerSettingBridge;

	private readonly envBridge: TestsEnvironmentalVariableBridge;

	private readonly rlActBridge: TestsActivationBridge;

	private readonly msgBridge: TestsMessageBridge;

	private readonly persisBridge: TestsPersisBridge;

	private readonly roomBridge: TestsRoomBridge;

	private readonly internalBridge: TestsInternalBridge;

	private readonly userBridge: TestsUserBridge;

	private readonly httpBridge: TestsHttpBridge;

	private readonly livechatBridge: TestLivechatBridge;

	private readonly uploadBridge: TestUploadBridge;

	private readonly uiIntegrationBridge: TestsUiIntegrationBridge;

	private readonly schedulerBridge: TestSchedulerBridge;

	private readonly cloudWorkspaceBridge: TestAppCloudWorkspaceBridge;

	private readonly videoConfBridge: TestsVideoConferenceBridge;

	private readonly oauthBridge: OAuthAppsBridge;

	constructor() {
		super();
		this.appDetails = new TestsAppDetailChangesBridge();
		this.cmdBridge = new TestsCommandBridge();
		this.apiBridge = new TestsApiBridge();
		this.setsBridge = new TestsServerSettingBridge();
		this.envBridge = new TestsEnvironmentalVariableBridge();
		this.rlActBridge = new TestsActivationBridge();
		this.msgBridge = new TestsMessageBridge();
		this.persisBridge = new TestsPersisBridge();
		this.roomBridge = new TestsRoomBridge();
		this.internalBridge = new TestsInternalBridge();
		this.userBridge = new TestsUserBridge();
		this.httpBridge = new TestsHttpBridge();
		this.livechatBridge = new TestLivechatBridge();
		this.uploadBridge = new TestUploadBridge();
		this.uiIntegrationBridge = new TestsUiIntegrationBridge();
		this.schedulerBridge = new TestSchedulerBridge();
		this.cloudWorkspaceBridge = new TestAppCloudWorkspaceBridge();
		this.videoConfBridge = new TestsVideoConferenceBridge();
		this.oauthBridge = new TestOAuthAppsBridge();
	}

	public getCommandBridge(): TestsCommandBridge {
		return this.cmdBridge;
	}

	public getApiBridge(): TestsApiBridge {
		return this.apiBridge;
	}

	public getServerSettingBridge(): ServerSettingBridge {
		return this.setsBridge;
	}

	public getEnvironmentalVariableBridge(): EnvironmentalVariableBridge {
		return this.envBridge;
	}

	public getAppDetailChangesBridge(): AppDetailChangesBridge {
		return this.appDetails;
	}

	public getHttpBridge(): HttpBridge {
		return this.httpBridge;
	}

	public getListenerBridge(): IListenerBridge {
		throw new Error('Method not implemented.');
	}

	public getMessageBridge(): MessageBridge {
		return this.msgBridge;
	}

	public getPersistenceBridge(): PersistenceBridge {
		return this.persisBridge;
	}

	public getAppActivationBridge(): AppActivationBridge {
		return this.rlActBridge;
	}

	public getRoomBridge(): RoomBridge {
		return this.roomBridge;
	}

	public getInternalBridge(): IInternalBridge {
		return this.internalBridge;
	}

	public getUserBridge(): UserBridge {
		return this.userBridge;
	}

	public getLivechatBridge(): LivechatBridge {
		return this.livechatBridge;
	}

	public getUploadBridge(): UploadBridge {
		return this.uploadBridge;
	}

	public getUiInteractionBridge(): UiInteractionBridge {
		return this.uiIntegrationBridge;
	}

	public getSchedulerBridge(): SchedulerBridge {
		return this.schedulerBridge;
	}

	public getCloudWorkspaceBridge(): CloudWorkspaceBridge {
		return this.cloudWorkspaceBridge;
	}

	public getVideoConferenceBridge(): VideoConferenceBridge {
		return this.videoConfBridge;
	}

	public getOAuthAppsBridge(): OAuthAppsBridge {
		return this.oauthBridge;
	}
}
