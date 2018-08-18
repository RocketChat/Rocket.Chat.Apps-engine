export declare enum AppInterface {
    IPreMessageSentPrevent = "IPreMessageSentPrevent",
    IPreMessageSentExtend = "IPreMessageSentExtend",
    IPreMessageSentModify = "IPreMessageSentModify",
    IPostMessageSent = "IPostMessageSent",
    IPreMessageDeletePrevent = "IPreMessageDeletePrevent",
    IPostMessageDeleted = "IPostMessageDeleted",
    IPreRoomCreatePrevent = "IPreRoomCreatePrevent",
    IPreRoomCreateExtend = "IPreRoomCreateExtend",
    IPreRoomCreateModify = "IPreRoomCreateModify",
    IPostRoomCreate = "IPostRoomCreate",
    IPreRoomDeletePrevent = "IPreRoomDeletePrevent",
    IPostRoomDeleted = "IPostRoomDeleted",
}
export declare class AppImplements {
    private implemented;
    constructor();
    doesImplement(int: string): void;
    getValues(): {
        [int: string]: boolean;
    };
}
