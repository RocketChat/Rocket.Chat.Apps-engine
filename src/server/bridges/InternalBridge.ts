import { ISetting } from '../../definition/settings';
import { BaseBridge } from './BaseBridge';

export abstract class InternalBridge extends BaseBridge {
   public async doGetUsernamesOfRoomById(roomId: string): Promise<Array<string>> {
       return this.getUsernamesOfRoomById(roomId);
    }

   public async doGetWorkspacePublicKey(): Promise<ISetting> {
      return this.getWorkspacePublicKey();
    }

   protected abstract getUsernamesOfRoomById(roomId: string): Promise<Array<string>>;
   protected abstract getWorkspacePublicKey(): Promise<ISetting>;
}
