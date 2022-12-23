import type { ISetting } from '../../../src/definition/settings';
import type { IInternalBridge } from '../../../src/server/bridges';

export class TestsInternalBridge implements IInternalBridge {
	public doGetUsernamesOfRoomById(roomId: string): Array<string> {
		throw new Error('Method not implemented.');
	}

	public doGetWorkspacePublicKey(): Promise<ISetting> {
		throw new Error('Method not implemented.');
	}
}
