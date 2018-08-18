import { IRoomBuilder } from '../../definition/accessors';
import { RocketChatAssociationModel } from '../../definition/metadata';
import { IRoom, RoomType } from '../../definition/rooms';
import { IUser } from '../../definition/users';
export declare class RoomBuilder implements IRoomBuilder {
    kind: RocketChatAssociationModel.ROOM;
    private room;
    constructor(data?: IRoom);
    setData(data: IRoom): IRoomBuilder;
    setDisplayName(name: string): IRoomBuilder;
    getDisplayName(): string;
    setSlugifiedName(name: string): IRoomBuilder;
    getSlugifiedName(): string;
    setType(type: RoomType): IRoomBuilder;
    getType(): RoomType;
    setCreator(creator: IUser): IRoomBuilder;
    getCreator(): IUser;
    addUsername(username: string): IRoomBuilder;
    setUsernames(usernames: Array<string>): IRoomBuilder;
    getUsernames(): Array<string>;
    setDefault(isDefault: boolean): IRoomBuilder;
    getIsDefault(): boolean;
    setReadOnly(isReadOnly: boolean): IRoomBuilder;
    getIsReadOnly(): boolean;
    setDisplayingOfSystemMessages(displaySystemMessages: boolean): IRoomBuilder;
    getDisplayingOfSystemMessages(): boolean;
    addCustomField(key: string, value: object): IRoomBuilder;
    setCustomFields(fields: {
        [key: string]: object;
    }): IRoomBuilder;
    getCustomFields(): {
        [key: string]: object;
    };
    getRoom(): IRoom;
}
