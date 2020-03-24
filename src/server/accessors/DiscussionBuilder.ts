import { IDiscussionBuilder } from '../../definition/accessors';
import { RocketChatAssociationModel } from '../../definition/metadata';
import { IDiscussion, RoomType } from '../../definition/rooms';
import { IRoom } from '../../definition/rooms/IRoom';
import { IUser } from '../../definition/users';

export class DiscussionBuilder implements IDiscussionBuilder {
    public kind: RocketChatAssociationModel.DISCUSSION;
    private parentRoom: IRoom;
    private room: IDiscussion;
    private members: Array<string>;

    constructor(data?: IDiscussion) {
        this.kind = RocketChatAssociationModel.DISCUSSION;
        this.room = data ? data : ({ customFields: {} } as IDiscussion);
        this.room.type = RoomType.PRIVATE_GROUP;
        this.members = new Array<string>();
    }

    public setData(data: IDiscussion): IDiscussionBuilder {
        delete data.id;
        this.room = data;

        return this;
    }

    public setDisplayName(name: string): IDiscussionBuilder {
        this.room.displayName = name;
        return this;
    }

    public getDisplayName(): string {
        return this.room.displayName;
    }

    public setSlugifiedName(name: string): IDiscussionBuilder {
        this.room.slugifiedName = name;
        return this;
    }

    public getSlugifiedName(): string {
        return this.room.slugifiedName;
    }

    public getType(): RoomType {
        return this.room.type;
    }

    public setCreator(creator: IUser): IDiscussionBuilder {
        this.room.creator = creator;
        return this;
    }

    public getCreator(): IUser {
        return this.room.creator;
    }

    /**
     * @deprecated
     */
    public addUsername(username: string): IDiscussionBuilder {
        this.addMemberToBeAddedByUsername(username);
        return this;
    }

    /**
     * @deprecated
     */
    public setUsernames(usernames: Array<string>): IDiscussionBuilder {
        this.setMembersToBeAddedByUsernames(usernames);
        return this;
    }

    /**
     * @deprecated
     */
    public getUsernames(): Array<string> {
        const usernames = this.getMembersToBeAddedUsernames();
        if (usernames && usernames.length > 0) {
            return usernames;
        }
        return this.room.usernames || [];
    }

    public addMemberToBeAddedByUsername(username: string): IDiscussionBuilder {
        this.members.push(username);
        return this;
    }

    public setMembersToBeAddedByUsernames(usernames: Array<string>): IDiscussionBuilder {
        this.members = usernames;
        return this;
    }

    public getMembersToBeAddedUsernames(): Array<string> {
        return this.members;
    }

    public setDefault(isDefault: boolean): IDiscussionBuilder {
        this.room.isDefault = isDefault;
        return this;
    }

    public getIsDefault(): boolean {
        return this.room.isDefault;
    }

    public setReadOnly(isReadOnly: boolean): IDiscussionBuilder {
        this.room.isReadOnly = isReadOnly;
        return this;
    }

    public getIsReadOnly(): boolean {
        return this.room.isReadOnly;
    }

    public setDisplayingOfSystemMessages(displaySystemMessages: boolean): IDiscussionBuilder {
        this.room.displaySystemMessages = displaySystemMessages;
        return this;
    }

    public getDisplayingOfSystemMessages(): boolean {
        return this.room.displaySystemMessages;
    }

    public addCustomField(key: string, value: object): IDiscussionBuilder {
        if (typeof this.room.customFields !== 'object') {
            this.room.customFields = {};
        }

        this.room.customFields[key] = value;
        return this;
    }

    public setCustomFields(fields: { [key: string]: object }): IDiscussionBuilder {
        this.room.customFields = fields;
        return this;
    }

    public getCustomFields(): { [key: string]: object } {
        return this.room.customFields;
    }

    public getRoom(): IDiscussion {
        return this.room;
    }
    public setParentRoom(parentRoom: IRoom): IDiscussionBuilder {
        this.parentRoom = parentRoom;
        return this;
    }

    public getParentRoom(): IRoom {
        return this.parentRoom;
    }
}
