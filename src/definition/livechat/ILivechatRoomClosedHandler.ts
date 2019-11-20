import { IHttp, IPersistence, IRead } from '../accessors';
import { AppMethod } from '../metadata';
import { ILivechatRoom } from './ILivechatRoom';

/**
 * Handler called after a livechat room is closed.
 */
export interface ILivechatRoomClosedHandler {
    /**
     * Method called *after* a livechat room is closed.
     *
     * @param livechatRoom The livechat room which is closed.
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    [AppMethod.EXECUTE_LIVECHAT_ROOM_CLOSED_HANDLER](data: ILivechatRoom, read: IRead, http: IHttp, persistence: IPersistence): Promise<void>;
}
