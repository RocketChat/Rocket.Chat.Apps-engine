export interface IUIKitIncomingInteractionContainer {
    type: string;
}
export interface IUIKitIncomingInteractionModalContainer extends IUIKitIncomingInteractionContainer {
    id: string;
}
export interface IUIKitIncomingInteractionMessageContainer extends IUIKitIncomingInteractionContainer {
    id: string; // TODO
}
