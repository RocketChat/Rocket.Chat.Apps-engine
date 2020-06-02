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
    IPostRoomUserJoined = 'IPostRoomUserJoined',
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
