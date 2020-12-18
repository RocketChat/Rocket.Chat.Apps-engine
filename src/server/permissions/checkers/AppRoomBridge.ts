import { IMessage } from '../../../definition/messages';
import { IRoom } from '../../../definition/rooms/IRoom';
import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppRoomBridge = {
    hasReadPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.room.read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.room.read],
            });
        }
    },
    hasWritePermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.room.write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.room.write],
            });
        }
    },
    create(room: IRoom, members: Array<string>, appId: string): void {
        return this.hasWritePermission(appId);
    },
    getById(roomId: string, appId: string): void {
        return this.hasReadPermission(appId);
    },
    getByName(roomName: string, appId: string): void {
        return this.hasReadPermission(appId);
    },
    getCreatorById(roomId: string, appId: string): void {
        return this.hasReadPermission(appId);
    },
    getCreatorByName(roomName: string, appId: string): void {
        return this.hasReadPermission(appId);
    },
    getDirectByUsernames(username: Array<string>, appId: string): void {
        return this.hasReadPermission(appId);
    },
    getMembers(roomId: string, appId: string): void {
        return this.hasReadPermission(appId);
    },
    update(room: IRoom, members: Array<string>, appId: string): void {
        return this.hasWritePermission(appId);
    },
    createDiscussion(room: IRoom, parentMessage: IMessage | undefined, reply: string | undefined, members: Array<string>, appId: string): void {
        return this.hasWritePermission(appId);
    },
};
