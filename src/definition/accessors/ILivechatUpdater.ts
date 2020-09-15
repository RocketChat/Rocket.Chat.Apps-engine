import { ILivechatTransferData, IVisitor } from '../livechat';
import { IRoom } from '../rooms';

export interface ILivechatUpdater {
    /**
     * Transfer a Livechat visitor to another room
     *
     * @param visitor Visitor to be transferred
     * @param transferData The data to execute the transferring
     */
    transferVisitor(visitor: IVisitor, transferData: ILivechatTransferData): Promise<boolean>;

    /**
     * Closes a Livechat room
     *
     * @param room The room to be closed
     * @param comment The comment explaining the reason for closing the room
     */
    closeRoom(room: IRoom, comment: string): Promise<boolean>;

    /**
     * Set a livechat visitor's custom fields by its token
     * @param token The visitor's token
     * @param key The key in the custom fields
     * @param value The value to be set
     * @param overwrite Whether overwrite or not
     *
     * @returns Promise to whether success or not
     */
    setCustomFields(token: IVisitor['token'], key: string, value: string, overwrite: boolean): Promise<boolean>;
}
