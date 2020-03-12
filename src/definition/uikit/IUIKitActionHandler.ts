import { IHttp, IModify, IPersistence, IRead } from '../accessors';
import { AppMethod } from '../metadata';
import { IUIKitResponse } from './IUIKitInteractionType';
import { UIKitBlockInteractionContext, UIKitContextualBarOpenInteractionContext, UIKitViewCloseInteractionContext, UIKitViewSubmitInteractionContext } from './UIKitInteractionContext';

/** Handler for after a message is sent. */
export interface IUIKitInteractionHandler {
    /**
     * Method called when a block action is invoked.
     *
     * @param context
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    [AppMethod.UIKIT_BLOCK_ACTION]?(context: UIKitBlockInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify):
        Promise<IUIKitResponse>;

    /**
     * Method called when a modal is submitted.
     *
     * @param context
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    [AppMethod.UIKIT_VIEW_SUBMIT]?(context: UIKitViewSubmitInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify):
        Promise<IUIKitResponse>;

    /**
     * Method called when a modal is closed.
     *
     * @param context
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    [AppMethod.UIKIT_VIEW_CLOSE]?(context: UIKitViewCloseInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify):
        Promise<IUIKitResponse>;

    /**
     * Method called when a contextual bar is open.
     *
     * @param context
     * @param read
     * @param http
     * @param persistence
     * @param modify
     */
    [AppMethod.UIKIT_CONTEXTUAL_BAR_OPEN]?(
        context: UIKitContextualBarOpenInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify,
    ): Promise<IUIKitResponse>;
}
