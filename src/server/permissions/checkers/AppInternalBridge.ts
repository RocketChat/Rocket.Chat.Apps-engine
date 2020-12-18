// It seems that it's an internal bridge that wasn't exposed.
// Pass all bridge methods by default.
export const AppInternalBridge = {
    getUsernamesOfRoomById(roomId: string): void {
        return;
    },
    getWorkspacePublicKey(): void {
        return;
    },
};
