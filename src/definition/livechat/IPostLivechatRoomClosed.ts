import { IHttp, IModify, IPersistence, IRead } from '../accessors';
import { AppMethod } from '../metadata';
import { ILivechatRoom } from './ILivechatRoom';

/**
 * Handler called after a livechat room is closed.
 */
export interface IPostLivechatRoomClosed {
    /**
     * Method called *after* a livechat room is closed.
     *
     * @param livechatRoom The livechat room which is closed.
     * @param read An accessor to the environment
     * @param modify An accessor to the modifier
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    [AppMethod.EXECUTE_POST_LIVECHAT_ROOM_CLOSED](
        room: ILivechatRoom, read: IRead, http: IHttp, modify: IModify, persis: IPersistence,
    ): Promise<void>;
}
