export interface IModifyDeleter {
    deleteRoom(roomId: string): Promise<void>;
    deleteMessage(messageId: string): Promise<void>;
}
