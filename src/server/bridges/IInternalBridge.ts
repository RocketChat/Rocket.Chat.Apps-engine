import { ISetting } from '../../definition/settings';

export interface IInternalBridge {
    name: string;
    getUsernamesOfRoomById(roomId: string): Array<string>;
    getWorkspacePublicKey(): Promise<ISetting>;
}
