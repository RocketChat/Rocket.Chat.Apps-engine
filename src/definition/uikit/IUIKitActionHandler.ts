import { IHttp, IModify, IPersistence, IRead } from '../accessors';
import { AppMethod } from '../metadata';
import { IUIKitInteractionResponse, IUIKitResponse } from './IUIKitResponse';
import { IUIKitViewClose } from './IUIKitViewClose';
import { IUIKitViewSubmit } from './IUIKitViewSubmit';
import { IUIKitBlockInteraction } from './UIKitInteractionContext';

/** Handler for after a message is sent. */
export interface IUIKitInteractionHandler {
    /**
     * Method called when a block action is invoked.
     *
     * @param data
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    [AppMethod.UIKIT_BLOCK_ACTION]?(data: IUIKitBlockInteraction, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify):
        Promise<IUIKitResponse | IUIKitInteractionResponse>;

    /**
     * Method called when a modal is submitted.
     *
     * @param data
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    [AppMethod.UIKIT_VIEW_SUBMIT]?(data: IUIKitViewSubmit, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify):
        Promise<IUIKitResponse | IUIKitInteractionResponse>;

    /**
     * Method called when a modal is closed.
     *
     * @param data
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    [AppMethod.UIKIT_VIEW_CLOSE]?(data: IUIKitViewClose, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify):
        Promise<IUIKitResponse>;
}
