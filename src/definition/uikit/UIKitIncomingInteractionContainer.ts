export interface IUIKitIncomingInteractionContainer {
    type: string;
}
export interface IUIKitIncomingInteractionModalContainer extends IUIKitIncomingInteractionContainer {
    id: string;
}
export interface IUIKitIncomingInteractionSlashCommandContainer extends IUIKitIncomingInteractionContainer {
    command: string; // TODO
}
export interface IUIKitIncomingInteractionMessageContainer extends IUIKitIncomingInteractionContainer {
    id: string; // TODO
}
