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

    public getDisplayName(): string {
        return this.room.displayName;
    }

    public setSlugifiedName(name: string): IRoomBuilder {
        this.room.slugifiedName = name;
        return this;
    }

    public getSlugifiedName(): string {
        return this.room.slugifiedName;
    }

    public setType(type: RoomType): IRoomBuilder {
        this.room.type = type;
        return this;
    }

    public getType(): RoomType {
        return this.room.type;
    }

    public setCreator(creator: IUser): IRoomBuilder {
        this.room.creator = creator;
        return this;
    }

    public getCreator(): IUser {
        return this.room.creator;
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

    public getUsernames(): Array<string> {
        return this.room.usernames;
    }

    public setDefault(isDefault: boolean): IRoomBuilder {
        this.room.isDefault = isDefault;
        return this;
    }

    public getDefault(): boolean {
        return this.room.isDefault;
    }

    public setReadOnly(isReadOnly: boolean): IRoomBuilder {
        this.room.isReadOnly = isReadOnly;
        return this;
    }

    public getReadOnly(): boolean {
        return this.room.isReadOnly;
    }

    public setDisplayingOfSystemMessages(displaySystemMessages: boolean): IRoomBuilder {
        this.room.displaySystemMessages = displaySystemMessages;
        return this;
    }

    public getDisplayingOfSystemMessages(): boolean {
        return this.room.displaySystemMessages;
    }

    public addCustomField(key: string, value: object): IRoomBuilder {
        if (typeof this.room.customFields !== 'object') {
            this.room.customFields = {};
        }

        this.room.customFields[key] = value;
        return this;
    }

    public setCustomFields(fields: { [key: string]: object }): IRoomBuilder {
        this.room.customFields = fields;
        return this;
    }

    public getCustomFields(): { [key: string]: object } {
      return this.room.customFields;
    }

    public getRoom(): IRoom {
        return this.room;
    }
}
