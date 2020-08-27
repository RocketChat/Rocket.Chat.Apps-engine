import { IHttp, IModify, IPersistence, IRead } from '../../accessors';
import { AppMethod } from '../../metadata';
import { IUIKitResponse } from '../IUIKitInteractionType';
import { UIKitLivechatBlockInteractionContext, UIKitLivechatViewCloseInteractionContext, UIKitLivechatViewSubmitInteractionContext } from './UIKitLivechatInteractionContext';

/** Handler for after a message is sent. */
export interface IUIKitLivechatInteractionHandler {
    /**
     * Method called when a block action is invoked.
     *
     * @param context
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    [AppMethod.UIKIT_LIVECHAT_BLOCK_ACTION]?(
        context: UIKitLivechatBlockInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
    ): Promise<IUIKitResponse>;

    /**
     * Method called when a modal is submitted.
     *
     * @param context
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    [AppMethod.UIKIT_LIVECHAT_VIEW_SUBMIT]?(
        context: UIKitLivechatViewSubmitInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
    ): Promise<IUIKitResponse>;

    /**
     * Method called when a modal is closed.
     *
     * @param context
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    [AppMethod.UIKIT_LIVECHAT_VIEW_CLOSE]?(
        context: UIKitLivechatViewCloseInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
    ): Promise<IUIKitResponse>;
}
