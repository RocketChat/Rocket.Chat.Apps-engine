export enum AppMethod {
    _API_EXECUTOR = 'apiExecutor',
    _CONSTRUCTOR = 'constructor',
    _COMMAND_EXECUTOR = 'executor',
    _COMMAND_PREVIEWER = 'previewer',
    _COMMAND_PREVIEW_EXECUTOR = 'executePreviewItem',
    _JOB_PROCESSOR = 'jobProcessor',
    INITIALIZE = 'initialize',
    ONENABLE = 'onEnable',
    ONDISABLE = 'onDisable',
    ONINSTALL = 'onInstall',
    ONUNINSTALL = 'onUninstall',
    ON_PRE_SETTING_UPDATE = 'onPreSettingUpdate',
    ONSETTINGUPDATED = 'onSettingUpdated',
    SETSTATUS = 'setStatus',
    // Message handlers
    CHECKPREMESSAGESENTPREVENT = 'checkPreMessageSentPrevent',
    EXECUTEPREMESSAGESENTPREVENT = 'executePreMessageSentPrevent',
    CHECKPREMESSAGESENTEXTEND = 'checkPreMessageSentExtend',
    EXECUTEPREMESSAGESENTEXTEND = 'executePreMessageSentExtend',
    CHECKPREMESSAGESENTMODIFY = 'checkPreMessageSentModify',
    EXECUTEPREMESSAGESENTMODIFY = 'executePreMessageSentModify',
    CHECKPOSTMESSAGESENT = 'checkPostMessageSent',
    EXECUTEPOSTMESSAGESENT = 'executePostMessageSent',
    CHECKPREMESSAGEDELETEPREVENT = 'checkPreMessageDeletePrevent',
    EXECUTEPREMESSAGEDELETEPREVENT = 'executePreMessageDeletePrevent',
    CHECKPOSTMESSAGEDELETED = 'checkPostMessageDeleted',
    EXECUTEPOSTMESSAGEDELETED = 'executePostMessageDeleted',
    CHECKPREMESSAGEUPDATEDPREVENT = 'checkPreMessageUpdatedPrevent',
    EXECUTEPREMESSAGEUPDATEDPREVENT = 'executePreMessageUpdatedPrevent',
    CHECKPREMESSAGEUPDATEDEXTEND = 'checkPreMessageUpdatedExtend',
    EXECUTEPREMESSAGEUPDATEDEXTEND = 'executePreMessageUpdatedExtend',
    CHECKPREMESSAGEUPDATEDMODIFY = 'checkPreMessageUpdatedModify',
    EXECUTEPREMESSAGEUPDATEDMODIFY = 'executePreMessageUpdatedModify',
    CHECKPOSTMESSAGEUPDATED = 'checkPostMessageUpdated',
    EXECUTEPOSTMESSAGEUPDATED = 'executePostMessageUpdated',
    // Room handlers
    CHECKPREROOMCREATEPREVENT = 'checkPreRoomCreatePrevent',
    EXECUTEPREROOMCREATEPREVENT = 'executePreRoomCreatePrevent',
    CHECKPREROOMCREATEEXTEND = 'checkPreRoomCreateExtend',
    EXECUTEPREROOMCREATEEXTEND = 'executePreRoomCreateExtend',
    CHECKPREROOMCREATEMODIFY = 'checkPreRoomCreateModify',
    EXECUTEPREROOMCREATEMODIFY = 'executePreRoomCreateModify',
    CHECKPOSTROOMCREATE = 'checkPostRoomCreate',
    EXECUTEPOSTROOMCREATE = 'executePostRoomCreate',
    CHECKPREROOMDELETEPREVENT = 'checkPreRoomDeletePrevent',
    EXECUTEPREROOMDELETEPREVENT = 'executePreRoomDeletePrevent',
    CHECKPOSTROOMDELETED = 'checkPostRoomDeleted',
    EXECUTEPOSTROOMDELETED = 'executePostRoomDeleted',
    EXECUTE_PRE_ROOM_USER_JOINED = 'executePreRoomUserJoined',
    EXECUTE_POST_ROOM_USER_JOINED = 'executePostRoomUserJoined',
    EXECUTE_PRE_ROOM_USER_LEAVE = 'executePreRoomUserLeave',
    EXECUTE_POST_ROOM_USER_LEAVE = 'executePostRoomUserLeave',
    // External Component handlers
    EXECUTEPOSTEXTERNALCOMPONENTOPENED = 'executePostExternalComponentOpened',
    EXECUTEPOSTEXTERNALCOMPONENTCLOSED = 'executePostExternalComponentClosed',
    // Blockit handlers
    UIKIT_BLOCK_ACTION = 'executeBlockActionHandler',
    UIKIT_VIEW_SUBMIT = 'executeViewSubmitHandler',
    UIKIT_VIEW_CLOSE = 'executeViewClosedHandler',
    UIKIT_ACTION_BUTTON = 'executeActionButtonHandler',
    UIKIT_LIVECHAT_BLOCK_ACTION = 'executeLivechatBlockActionHandler',
    // Livechat
    EXECUTE_POST_LIVECHAT_ROOM_STARTED = 'executePostLivechatRoomStarted',
    /**
     * @deprecated please use the AppMethod.EXECUTE_POST_LIVECHAT_ROOM_CLOSED method
     */
    EXECUTE_LIVECHAT_ROOM_CLOSED_HANDLER = 'executeLivechatRoomClosedHandler',
    EXECUTE_POST_LIVECHAT_ROOM_CLOSED = 'executePostLivechatRoomClosed',
    EXECUTE_POST_LIVECHAT_AGENT_ASSIGNED = 'executePostLivechatAgentAssigned',
    EXECUTE_POST_LIVECHAT_AGENT_UNASSIGNED = 'executePostLivechatAgentUnassigned',
    EXECUTE_POST_LIVECHAT_ROOM_TRANSFERRED = 'executePostLivechatRoomTransferred',
    EXECUTE_POST_LIVECHAT_GUEST_SAVED = 'executePostLivechatGuestSaved',
    EXECUTE_POST_LIVECHAT_ROOM_SAVED = 'executePostLivechatRoomSaved',
    // FileUpload
    EXECUTE_PRE_FILE_UPLOAD = 'executePreFileUpload',
    // Email
    EXECUTE_PRE_EMAIL_SENT = 'executePreEmailSent',
    // User
    EXECUTE_POST_USER_CREATED = 'executePostUserCreated',
    EXECUTE_POST_USER_UPDATED = 'executePostUserUpdated',
    EXECUTE_POST_USER_DELETED = 'executePostUserDeleted',
    EXECUTE_POST_USER_LOGGED_IN = 'executePostUserLoggedIn',
    EXECUTE_POST_USER_LOGGED_OUT = 'executePostUserLoggedOut',
}
}
