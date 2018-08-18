"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppMethod;
(function (AppMethod) {
    AppMethod["_CONSTRUCTOR"] = "constructor";
    AppMethod["_COMMAND_EXECUTOR"] = "executor";
    AppMethod["_COMMAND_PREVIEWER"] = "previewer";
    AppMethod["_COMMAND_PREVIEW_EXECUTOR"] = "executePreviewItem";
    AppMethod["INITIALIZE"] = "initialize";
    AppMethod["ONENABLE"] = "onEnable";
    AppMethod["ONDISABLE"] = "onDisable";
    AppMethod["ONSETTINGUPDATED"] = "onSettingUpdated";
    AppMethod["SETSTATUS"] = "setStatus";
    // Message handlers
    AppMethod["CHECKPREMESSAGESENTPREVENT"] = "checkPreMessageSentPrevent";
    AppMethod["EXECUTEPREMESSAGESENTPREVENT"] = "executePreMessageSentPrevent";
    AppMethod["CHECKPREMESSAGESENTEXTEND"] = "checkPreMessageSentExtend";
    AppMethod["EXECUTEPREMESSAGESENTEXTEND"] = "executePreMessageSentExtend";
    AppMethod["CHECKPREMESSAGESENTMODIFY"] = "checkPreMessageSentModify";
    AppMethod["EXECUTEPREMESSAGESENTMODIFY"] = "executePreMessageSentModify";
    AppMethod["CHECKPOSTMESSAGESENT"] = "checkPostMessageSent";
    AppMethod["EXECUTEPOSTMESSAGESENT"] = "executePostMessageSent";
    AppMethod["CHECKPREMESSAGEDELETEPREVENT"] = "checkPreMessageDeletePrevent";
    AppMethod["EXECUTEPREMESSAGEDELETEPREVENT"] = "executePreMessageDeletePrevent";
    AppMethod["CHECKPOSTMESSAGEDELETED"] = "checkPostMessageDeleted";
    AppMethod["EXECUTEPOSTMESSAGEDELETED"] = "executePostMessageDeleted";
    // Room handlers
    AppMethod["CHECKPREROOMCREATEPREVENT"] = "checkPreRoomCreatePrevent";
    AppMethod["EXECUTEPREROOMCREATEPREVENT"] = "executePreRoomCreatePrevent";
    AppMethod["CHECKPREROOMCREATEEXTEND"] = "checkPreRoomCreateExtend";
    AppMethod["EXECUTEPREROOMCREATEEXTEND"] = "executePreRoomCreateExtend";
    AppMethod["CHECKPREROOMCREATEMODIFY"] = "checkPreRoomCreateModify";
    AppMethod["EXECUTEPREROOMCREATEMODIFY"] = "executePreRoomCreateModify";
    AppMethod["CHECKPOSTROOMCREATE"] = "checkPostRoomCreate";
    AppMethod["EXECUTEPOSTROOMCREATE"] = "executePostRoomCreate";
    AppMethod["CHECKPREROOMDELETEPREVENT"] = "checkPreRoomDeletePrevent";
    AppMethod["EXECUTEPREROOMDELETEPREVENT"] = "executePreRoomDeletePrevent";
    AppMethod["CHECKPOSTROOMDELETED"] = "checkPostRoomDeleted";
    AppMethod["EXECUTEPOSTROOMDELETED"] = "executePostRoomDeleted";
})(AppMethod = exports.AppMethod || (exports.AppMethod = {}));

//# sourceMappingURL=AppMethod.js.map
