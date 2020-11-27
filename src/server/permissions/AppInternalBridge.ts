// It seems its the internal bridge that wasn't exposed.
// might need to remove it later
export const AppInternalBridge = {
    getUsernamesOfRoomById(roomId: string): void {
        return;
    },
    getWorkspacePublicKey(): void {
        return;
    },
};
