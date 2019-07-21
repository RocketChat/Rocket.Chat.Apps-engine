import { ISetting } from '../../definition/settings';

export interface IInternalBridge {
    getUsernamesOfRoomById(roomId: string): Array<string>;
    getWorkspacePublicKey(): Promise<ISetting>;
}
