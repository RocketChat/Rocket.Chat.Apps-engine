import { ISetting } from '../../../src/definition/settings';
import { IInternalBridge } from '../../../src/server/bridges';

export class TestsInternalBridge implements IInternalBridge {
    public getUsernamesOfRoomById(roomId: string): Array<string> {
        throw new Error('Method not implemented.');
    }

    public getWorkspacePublicKey(): Promise<ISetting> {
        throw new Error('Method not implemented.');
    }
}
