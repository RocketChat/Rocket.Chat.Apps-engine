import { IMessage } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';
import { BaseBridge } from './BaseBridge';

export abstract class RoomBridge extends BaseBridge {
    public async doCreate(room: IRoom, members: Array<string>, appId: string): Promise<string> {
        this.checkWritePermission(appId);

        return this.create(room, members, appId);
    }

    public async doGetById(roomId: string, appId: string): Promise<IRoom> {
        this.checkReadPermission(appId);

        return this.getById(roomId, appId);
    }

    public async doGetByName(roomName: string, appId: string): Promise<IRoom> {
        this.checkReadPermission(appId);

        return this.getByName(roomName, appId);
    }

    public async doGetCreatorById(roomId: string, appId: string): Promise<IUser> {
        this.checkReadPermission(appId);

        return this.getCreatorById(roomId, appId);
    }

    public async doGetCreatorByName(roomName: string, appId: string): Promise<IUser> {
        this.checkReadPermission(appId);

        return this.getCreatorByName(roomName, appId);
    }

    public async doGetDirectByUsernames(usernames: Array<string>, appId: string): Promise<IRoom> {
        this.checkReadPermission(appId);

        return this.getDirectByUsernames(usernames, appId);
    }

    public async doGetMembers(roomId: string, appId: string): Promise<Array<IUser>> {
        this.checkReadPermission(appId);

        return this.getMembers(roomId, appId);
    }

    public async doUpdate(room: IRoom, members: Array<string>, appId: string): Promise<void> {
        this.checkWritePermission(appId);

        return this.update(room, members, appId);
    }

    public async doCreateDiscussion(room: IRoom, parentMessage: IMessage | undefined,
                                    reply: string | undefined, members: Array<string>, appId: string): Promise<string> {
        this.checkWritePermission(appId);

        return this.createDiscussion(room, parentMessage, reply, members, appId);
    }

    protected abstract create(room: IRoom, members: Array<string>, appId: string): Promise<string>;
    protected abstract getById(roomId: string, appId: string): Promise<IRoom>;
    protected abstract getByName(roomName: string, appId: string): Promise<IRoom>;
    protected abstract getCreatorById(roomId: string, appId: string): Promise<IUser>;
    protected abstract getCreatorByName(roomName: string, appId: string): Promise<IUser>;
    protected abstract getDirectByUsernames(usernames: Array<string>, appId: string): Promise<IRoom>;
    protected abstract getMembers(roomId: string, appId: string): Promise<Array<IUser>>;
    protected abstract update(room: IRoom, members: Array<string>, appId: string): Promise<void>;
    protected abstract createDiscussion(room: IRoom, parentMessage: IMessage | undefined,
                                        reply: string | undefined, members: Array<string>, appId: string): Promise<string>;

    private checkWritePermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.room.write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.room.write],
            });
        }
    }

    private checkReadPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.room.read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.room.read],
            });
        }
    }
}
