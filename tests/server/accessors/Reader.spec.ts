import { Expect, SetupFixture, Test } from 'alsatian';

import type {
	ICloudWorkspaceRead,
	IEnvironmentRead,
	ILivechatRead,
	IMessageRead,
	INotifier,
	IPersistenceRead,
	IRoomRead,
	IUploadRead,
	IUserRead,
	IVideoConferenceRead,
} from '../../../src/definition/accessors';
import type { IOAuthAppsReader } from '../../../src/definition/accessors/IOAuthAppsReader';
import { Reader } from '../../../src/server/accessors';

export class ReaderAccessorTestFixture {
	private env: IEnvironmentRead;

	private msg: IMessageRead;

	private pr: IPersistenceRead;

	private rm: IRoomRead;

	private ur: IUserRead;

	private ni: INotifier;

	private livechat: ILivechatRead;

	private upload: IUploadRead;

	private cloud: ICloudWorkspaceRead;

	private videoConf: IVideoConferenceRead;

	private oauthApps: IOAuthAppsReader;

	@SetupFixture
	public setupFixture() {
		this.env = {} as IEnvironmentRead;
		this.msg = {} as IMessageRead;
		this.pr = {} as IPersistenceRead;
		this.rm = {} as IRoomRead;
		this.ur = {} as IUserRead;
		this.ni = {} as INotifier;
		this.livechat = {} as ILivechatRead;
		this.upload = {} as IUploadRead;
		this.cloud = {} as ICloudWorkspaceRead;
		this.videoConf = {} as IVideoConferenceRead;
		this.oauthApps = {} as IOAuthAppsReader;
	}

	@Test()
	public useReader() {
		Expect(
			() =>
				new Reader(
					this.env,
					this.msg,
					this.pr,
					this.rm,
					this.ur,
					this.ni,
					this.livechat,
					this.upload,
					this.cloud,
					this.videoConf,
					this.oauthApps,
				),
		).not.toThrow();

		const rd = new Reader(
			this.env,
			this.msg,
			this.pr,
			this.rm,
			this.ur,
			this.ni,
			this.livechat,
			this.upload,
			this.cloud,
			this.videoConf,
			this.oauthApps,
		);
		Expect(rd.getEnvironmentReader()).toBeDefined();
		Expect(rd.getMessageReader()).toBeDefined();
		Expect(rd.getNotifier()).toBeDefined();
		Expect(rd.getPersistenceReader()).toBeDefined();
		Expect(rd.getRoomReader()).toBeDefined();
		Expect(rd.getUserReader()).toBeDefined();
		Expect(rd.getLivechatReader()).toBeDefined();
		Expect(rd.getUploadReader()).toBeDefined();
		Expect(rd.getVideoConferenceReader()).toBeDefined();
	}
}
