import { Utilities } from '../misc/Utilities';

export enum AppInterface {
    // Messages
    IPreMessageSentPrevent = 'IPreMessageSentPrevent',
    IPreMessageSentExtend = 'IPreMessageSentExtend',
    IPreMessageSentModify = 'IPreMessageSentModify',
    IPostMessageSent = 'IPostMessageSent',
    IPreMessageDeletePrevent = 'IPreMessageDeletePrevent',
    IPostMessageDeleted = 'IPostMessageDeleted',
    IPreMessageUpdatedPrevent = 'IPreMessageUpdatedPrevent',
    IPreMessageUpdatedExtend = 'IPreMessageUpdatedExtend',
    IPreMessageUpdatedModify = 'IPreMessageUpdatedModify',
    IPostMessageUpdated = 'IPostMessageUpdated',
    // Rooms
    IPreRoomCreatePrevent = 'IPreRoomCreatePrevent',
    IPreRoomCreateExtend = 'IPreRoomCreateExtend',
    IPreRoomCreateModify = 'IPreRoomCreateModify',
    IPostRoomCreate = 'IPostRoomCreate',
    IPreRoomDeletePrevent = 'IPreRoomDeletePrevent',
    IPostRoomDeleted = 'IPostRoomDeleted',
    IPreRoomUserJoined = 'IPreRoomUserJoined',
    // External Components
    IPostExternalComponentOpened = 'IPostExternalComponentOpened',
    IPostExternalComponentClosed = 'IPostExternalComponentClosed',
    // Blocks
    IUIKitInteractionHandler = 'IUIKitInteractionHandler',
    // Livechat
    IPostLivechatRoomStarted = 'IPostLivechatRoomStarted',
    IPostLivechatRoomClosed = 'IPostLivechatRoomClosed',
    /**
     * @deprecated please use the AppMethod.EXECUTE_POST_LIVECHAT_ROOM_CLOSED method
     */
    ILivechatRoomClosedHandler = 'ILivechatRoomClosedHandler',
    IPostLivechatAgentAssigned = 'IPostLivechatAgentAssigned',
    IPostLivechatAgentUnassigned = 'IPostLivechatAgentUnassigned',
}

export class AppImplements {
    private implemented: { [key: string]: boolean };

    constructor() {
        this.implemented = {};
        Object.keys(AppInterface).forEach((int) => this.implemented[int] = false);
    }

    public doesImplement(int: string): void {
        if (int in AppInterface) {
            this.implemented[int] = true;
        }
    }

    public getValues(): { [int: string]: boolean } {
        return Utilities.deepCloneAndFreeze(this.implemented);
    }
}
