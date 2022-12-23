import type { ISetting } from '../../definition/settings';

export interface IInternalBridge {
	doGetUsernamesOfRoomById(roomId: string): Array<string>;
	doGetWorkspacePublicKey(): Promise<ISetting>;
}
