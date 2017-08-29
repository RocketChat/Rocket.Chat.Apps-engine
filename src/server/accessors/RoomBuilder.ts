import { IRoomBuilder } from 'temporary-rocketlets-ts-definition/accessors';
import { RocketChatAssociationModel } from 'temporary-rocketlets-ts-definition/metadata';
import { IRoom, RoomType } from 'temporary-rocketlets-ts-definition/rooms';
import { IUser } from 'temporary-rocketlets-ts-definition/users';

export class RoomBuilder implements IRoomBuilder {
    public kind: RocketChatAssociationModel.ROOM;
    private room: IRoom;

    constructor(data?: IRoom) {
        this.kind = RocketChatAssociationModel.ROOM;
        this.room = data ? data : ({} as IRoom);
    }

    public setCreator(creator: IUser): IRoomBuilder {
        this.room.creator = creator;
        return this;
    }

    public setName(name: string): IRoomBuilder {
        this.room.name = name;
        return this;
    }

    public setType(type: RoomType): IRoomBuilder {
        this.room.type = type;
        return this;
    }

    public setDefault(isDefault: boolean): IRoomBuilder {
        this.room.isDefault = isDefault;
        return this;
    }

    public addUsername(username: string): IRoomBuilder {
        if (!this.room.usernames) {
            this.room.usernames = new Array<string>();
        }

        this.room.usernames.push(username);
        return this;
    }

    public setUsers(users: Array<string>): IRoomBuilder {
        this.room.usernames = users;
        return this;
    }

    public getRoom(): IRoom {
        return this.room;
    }
}
