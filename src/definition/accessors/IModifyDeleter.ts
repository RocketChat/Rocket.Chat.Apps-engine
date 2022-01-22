export interface IModifyDeleter {
    deleteRoom(roomId: string): Promise<void>;
    /*Deletes a message given a messageId*/
    deleteMessage(messageId: string): Promise<void>;
}
