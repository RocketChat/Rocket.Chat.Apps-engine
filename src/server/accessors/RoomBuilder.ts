import { IRoomBuilder } from '@rocket.chat/apps-ts-definition/accessors';
import { RocketChatAssociationModel } from '@rocket.chat/apps-ts-definition/metadata';
import { IRoom, RoomType } from '@rocket.chat/apps-ts-definition/rooms';
import { IUser } from '@rocket.chat/apps-ts-definition/users';

export class RoomBuilder implements IRoomBuilder {
    public kind: RocketChatAssociationModel.ROOM;
    private room: IRoom;

    constructor(data?: IRoom) {
        this.kind = RocketChatAssociationModel.ROOM;
        this.room = data ? data : ({ customFields: {} } as IRoom);
    }

    public setData(data: IRoom): IRoomBuilder {
        delete data.id;
        this.room = data;

        return this;
    }

    public setDisplayName(name: string): IRoomBuilder {
        this.room.displayName = name;
        return this;
    }

    public setSlugifiedName(name: string): IRoomBuilder {
        this.room.slugifiedName = name;
        return this;
    }

    public setType(type: RoomType): IRoomBuilder {
        this.room.type = type;
        return this;
    }

    public setCreator(creator: IUser): IRoomBuilder {
        this.room.creator = creator;
        return this;
    }

    public addUsername(username: string): IRoomBuilder {
        if (!this.room.usernames) {
            this.room.usernames = new Array<string>();
        }

        this.room.usernames.push(username);
        return this;
    }

    public setUsernames(usernames: Array<string>): IRoomBuilder {
        this.room.usernames = usernames;
        return this;
    }

    public setDefault(isDefault: boolean): IRoomBuilder {
        this.room.isDefault = isDefault;
        return this;
    }

    public setReadOnly(isReadOnly: boolean): IRoomBuilder {
        this.room.isReadOnly = isReadOnly;
        return this;
    }

    public setDisplayingOfSystemMessages(displaySystemMessages: boolean): IRoomBuilder {
        this.room.displaySystemMessages = displaySystemMessages;
        return this;
    }

    public addCustomField(key: string, value: object): IRoomBuilder {
        this.room.customFields[key] = value;
        return this;
    }

    public setCustomFields(fields: { [key: string]: object }): IRoomBuilder {
        this.room.customFields = fields;
        return this;
    }

    public getRoom(): IRoom {
        return Object.create(this.room);
    }
}
