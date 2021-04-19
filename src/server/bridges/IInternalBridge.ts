import { ISetting } from '../../definition/settings';

export interface IInternalBridge {
    getUsernamesOfRoomById(roomId: string): Array<string>;
    doGetUsernamesOfRoomById(roomId: string): Array<string>;
    getWorkspacePublicKey(): Promise<ISetting>;
    doGetWorkspacePublicKey(): Promise<ISetting>;
}
