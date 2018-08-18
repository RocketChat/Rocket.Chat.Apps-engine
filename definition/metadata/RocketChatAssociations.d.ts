export declare enum RocketChatAssociationModel {
    ROOM = "room",
    MESSAGE = "message",
    USER = "user",
    FILE = "file",
    MISC = "misc",
}
export declare class RocketChatAssociationRecord {
    private model;
    private id;
    constructor(model: RocketChatAssociationModel, id: string);
    getModel(): RocketChatAssociationModel;
    getID(): string;
}
