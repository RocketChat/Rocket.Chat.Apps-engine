import { IRoomBuilder } from '../../definition/accessors';
import { isLivechatFromApp, isLivechatRoom } from '../../definition/livechat/ILivechatRoom';
import { RocketChatAssociationModel } from '../../definition/metadata';
import { IRoom, RoomType } from '../../definition/rooms';
import { IUser } from '../../definition/users';

export class RoomBuilder implements IRoomBuilder {
    public kind: RocketChatAssociationModel.ROOM | RocketChatAssociationModel.DISCUSSION;
    protected room: IRoom;
    private members: Array<string>;

    constructor(data?: Partial<IRoom>) {
        this.kind = RocketChatAssociationModel.ROOM;
        this.room = (data ? data : { customFields: {} }) as IRoom;
        this.members = new Array<string>();
    }

    public setData(data: Partial<IRoom>): IRoomBuilder {
        delete data.id;
        this.room = data as IRoom;

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

    /**
     * @deprecated
     */
    public addUsername(username: string): IRoomBuilder {
        this.addMemberToBeAddedByUsername(username);
        return this;
    }

    /**
     * @deprecated
     */
    public setUsernames(usernames: Array<string>): IRoomBuilder {
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

    public addMemberToBeAddedByUsername(username: string): IRoomBuilder {
        this.members.push(username);
        return this;
    }

    public setMembersToBeAddedByUsernames(usernames: Array<string>): IRoomBuilder {
        this.members = usernames;
        return this;
    }

    public getMembersToBeAddedUsernames(): Array<string> {
        return this.members;
    }

    public setDefault(isDefault: boolean): IRoomBuilder {
        this.room.isDefault = isDefault;
        return this;
    }

    public getIsDefault(): boolean {
        return this.room.isDefault;
    }

    public setReadOnly(isReadOnly: boolean): IRoomBuilder {
        this.room.isReadOnly = isReadOnly;
        return this;
    }

    public getIsReadOnly(): boolean {
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

    public getUserIds(): Array<string> {
      return this.room.userIds;
    }

    public getRoom(): IRoom {
        return this.room;
    }
    public setSourceSidebarIcon(sidebarIcon: string): IRoomBuilder {
        if (!isLivechatRoom(this.room)) {
            throw new Error('Only Omnichannel rooms can have a sidebar icon');
        }
        if (!isLivechatFromApp(this.room)) {
            throw new Error(
                'Only Omnichannel rooms created by apps can have a sidebar icon',
            );
        }
        this.room.source.sidebarIcon = sidebarIcon;
        return this;
    }

    public getSourceSidebarIcon(): string | undefined {
        if (!isLivechatRoom(this.room)) {
            throw new Error('Only Omnichannel rooms can have a sidebar icon');
        }
        if (!isLivechatFromApp(this.room)) {
            throw new Error(
                'Only Omnichannel rooms created by apps can have a sidebar icon',
            );
        }
        return this.room.source.sidebarIcon;
    }

    public setSourceDefaultIcon(defaultIcon: string): IRoomBuilder {
        if (!isLivechatRoom(this.room)) {
            throw new Error('Only Omnichannel rooms can have a default icon');
        }
        if (!isLivechatFromApp(this.room)) {
            throw new Error(
                'Only Omnichannel rooms created by apps can have a default icon',
            );
        }
        this.room.source.defaultIcon = defaultIcon;
        return this;
    }

    public getSourceDefaultIcon(): string | undefined {
        if (!isLivechatRoom(this.room)) {
            throw new Error('Only Omnichannel rooms can have a default icon');
        }
        if (!isLivechatFromApp(this.room)) {
            throw new Error(
                'Only Omnichannel rooms created by apps can have a default icon',
            );
        }
        return this.room.source.defaultIcon;
    }
}
