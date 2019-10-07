import { ILivechatTransferData, IVisitor } from '../livechat';
import { IRoom } from '../rooms';

export interface ILivechatUpdater {
    /**
     * Transfer a Livechat visitor to another room
     *
     * @param visitor Visitor to be transfered
     * @param transferData The data to execute the transfering
     */
    transferVisitor(visitor: IVisitor, transferData: ILivechatTransferData): Promise<boolean>;

    /**
     * Closes a Livechat room
     *
     * @param room The room to be closed
     * @param comment The comment explaining the reason for closing the room
     */
    closeRoom(room: IRoom, comment: string): Promise<boolean>;
}
