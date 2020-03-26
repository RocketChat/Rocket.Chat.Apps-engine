import { IHttp, IPersistence, IRead } from '../accessors';
import { AppMethod } from '../metadata';
import { ILivechatContext } from './ILivechatContext';

/**
 * Handler called after the unassignment of a livechat agent.
 */
export interface ILivechatUnassignAgentHandler {
    /**
     * Handler called *after* the unassignment of a livechat agent.
     *
     * @param data the livechat context data which contains agent's info and room's info.
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    [AppMethod.EXECUTE_LIVECHAT_UNASSIGN_AGENT_HANDLER](data: ILivechatContext, read: IRead, http: IHttp, persistence: IPersistence): Promise<void>;
}
