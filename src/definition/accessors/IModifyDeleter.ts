export interface IModifyDeleter {
    deleteRoom(roomId: string): Promise<void>;
}
