import { ISetting } from '../../definition/settings';

export interface IInternalBridge {
    doGetUsernamesOfRoomById(roomId: string): Promise<Array<string>>;
    doGetWorkspacePublicKey(): Promise<ISetting>;
}
