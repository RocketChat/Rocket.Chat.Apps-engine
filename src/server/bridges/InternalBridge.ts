import { ISetting } from '../../definition/settings';
import { BaseBridge } from './BaseBridge';

export abstract class InternalBridge extends BaseBridge {
   public doGetUsernamesOfRoomById(roomId: string): Array<string> {
       return this.getUsernamesOfRoomById(roomId);
    }

   public async doGetWorkspacePublicKey(): Promise<ISetting> {
      return this.getWorkspacePublicKey();
    }

   protected abstract getUsernamesOfRoomById(roomId: string): Array<string>;
   protected abstract getWorkspacePublicKey(): Promise<ISetting>;
}
