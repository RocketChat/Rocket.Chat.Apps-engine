import { IHttp, IPersistence, IRead } from '../accessors';
import { AppMethod } from '../metadata';
import { ILivechatContext } from './ILivechatContext';

/**
 * Handler called after the unassignment of a livechat agent.
 */
export interface ILivechatAssignAgentHandler {
    /**
     * Handler called *after* the unassignment of a livechat agent.
     *
     * @param agent The agent unassigned.
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    [AppMethod.EXECUTE_LIVECHAT_UNASSIGN_AGENT_HANDLER](data: ILivechatContext, read: IRead, http: IHttp, persistence: IPersistence): Promise<void>;
}
