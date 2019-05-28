import { ILivechatMessage, ILivechatRoom, ILivechatTransferData } from '../livechat';
import { IVisitor } from '../livechat/IVisitor';
import { IMessage, IMessageAttachment } from '../messages';
import { RocketChatAssociationModel } from '../metadata';
import { IRoom, RoomType } from '../rooms';
import { IUser } from '../users';

export interface IModify {
    getCreator(): IModifyCreator;

    getExtender(): IModifyExtender;

    getUpdater(): IModifyUpdater;

    /**
     * Gets the accessor for sending notifications to a user or users in a room.
     *
     * @returns the notifier accessor
     */
    getNotifier(): INotifier;
}

export interface INotifier {
    /**
     * Notifies the provided user of the provided message.
     *
     * **Note**: Notifications only are shown to the user if they are
     * online and it only stays around for the duration of their session.
     *
     * @param user The user who should be notified
     * @param message The message with the content to notify the user about
     */
    notifyUser(user: IUser, message: IMessage): Promise<void>;

    /**
     * Notifies all of the users in the provided room.
     *
     * **Note**: Notifications only are shown to those online
     * and it only stays around for the duration of their session.
     *
     * @param room The room which to notify the users in
     * @param message The message content to notify users about
     */
    notifyRoom(room: IRoom, message: IMessage): Promise<void>;

    /** Gets a new message builder for building a notification message. */
    getMessageBuilder(): IMessageBuilder;
}

export interface IModifyUpdater {
    /**
     * Get the updater object responsible for the
     * Livechat integrations
     */
    getLivechatUpdater(): ILivechatUpdater;
    /**
     * Modifies an existing message.
     * Raises an exception if a non-existent messageId is supplied
     *
     * @param messageId the id of the existing message to modfiy and build
     * @param updater the user who is updating the message
     */
    message(messageId: string, updater: IUser): Promise<IMessageBuilder>;

    /**
     * Modifies an existing room.
     * Raises an exception if a non-existent roomId is supplied
     *
     * @param roomId the id of the existing room to modify and build
     * @param updater the user who is updating the room
     */
    room(roomId: string, updater: IUser): Promise<IRoomBuilder>;

    /**
     * Finishes the updating process, saving the object to the database.
     * Note: If there is an issue or error while updating, this will throw an error.
     *
     * @param builder the builder instance
     */
    finish(builder: IMessageBuilder | IRoomBuilder): Promise<void>;
}

export interface IModifyExtender {
    /**
     * Modifies a message in a non-destructive way: Properties can be added to it,
     * but existing properties cannot be changed.
     *
     * @param messageId the id of the message to be extended
     * @param updater the user who is updating/extending the message
     * @return the extender instance for the message
     */
    extendMessage(messageId: string, updater: IUser): Promise<IMessageExtender>;

    /**
     * Modifies a room in a non-destructive way: Properties can be added to it,
     * but existing properties cannot be changed.
     *
     * @param roomId the id of the room to be extended
     * @param updater the user who is updating/extending the room
     * @return the extender instance for the room
     */
    extendRoom(roomId: string, updater: IUser): Promise<IRoomExtender>;

    /**
     * Finishes the extending process, saving the object to the database.
     * Note: If there is an issue or error while updating, this will throw an error.
     *
     * @param extender the extender instance
     */
    finish(extender: IRoomExtender | IMessageExtender): Promise<void>;
}

export interface IModifyCreator {
    /**
     * Get the creator object responsible for the
     * Livechat integrations
     */
    getLivechatCreator(): ILivechatCreator;
    /**
     * Starts the process for building a new message object.
     *
     * @param data (optional) the initial data to pass into the builder,
     *          the `id` property will be ignored
     * @return an IMessageBuilder instance
     */
    startMessage(data?: IMessage): IMessageBuilder;

    /**
     * Starts the process for building a new livechat message object.
     *
     * @param data (optional) the initial data to pass into the builder,
     *          the `id` property will be ignored
     * @return an IMessageBuilder instance
     */
    startLivechatMessage(data?: ILivechatMessage): ILivechatMessageBuilder;

    /**
     * Starts the process for building a new room.
     *
     * @param data (optional) the initial data to pass into the builder,
     *          the `id` property will be ignored
     * @return an IRoomBuilder instance
     */
    startRoom(data?: IRoom): IRoomBuilder;

    /**
     * Finishes the creating process, saving the object to the database.
     *
     * @param builder the builder instance
     * @return the resulting `id` of the resulting object
     */
    finish(builder: IMessageBuilder | ILivechatMessageBuilder | IRoomBuilder): Promise<string>;
}

export interface ILivechatCreator {
    /**
     * Creates a room to connect the `visitor` to an `agent`.
     *
     * This method uses the Livechat routing method configured
     * in the server
     *
     * @param visitor The Livechat Visitor that started the conversation
     * @param agent The agent responsible for the room
     */
    createRoom(visitor: IVisitor, agent: IUser): Promise<ILivechatRoom>;
    /**
     * Creates a Livechat visitor
     *
     * @param visitor Data of the visitor to be created
     */
    createVisitor(visitor: IVisitor): Promise<string>;
}

export interface ILivechatUpdater {
    /**
     * Transfer a Livechat visitor to another room
     *
     * @param visitor Visitor to be transfered
     * @param transferData The data to execute the transfering
     */
    transferVisitor(visitor: IVisitor, transferData: ILivechatTransferData): Promise<boolean>;
    /**
     * Closes a Livechat room
     *
     * @param room The room to be closed
     * @param comment The comment explaining the reason for closing the room
     */
    closeRoom(room: IRoom, comment: string): Promise<boolean>;
}

export interface IMessageExtender {
    kind: RocketChatAssociationModel.MESSAGE;

    /**
     * Adds a custom field to the message.
     * Note: This key can not already exist or it will throw an error.
     * Note: The key must not contain a period in it, an error will be thrown.
     *
     * @param key the name of the custom field
     * @param value the value of this custom field
     */
    addCustomField(key: string, value: any): IMessageExtender;

    /**
     * Adds a single attachment to the message.
     *
     * @param attachment the item to add
     */
    addAttachment(attachment: IMessageAttachment): IMessageExtender;

    /**
     * Adds all of the provided attachments to the message.
     *
     * @param attachments an array of attachments
     */
    addAttachments(attachments: Array<IMessageAttachment>): IMessageExtender;

    /**
     * Gets the resulting message that has been extended at the point of calling it.
     * Note: modifying the returned value will have no effect.
     */
    getMessage(): IMessage;
}

export interface IRoomExtender {
    kind: RocketChatAssociationModel.ROOM;

    /**
     * Adds a custom field to the room.
     * Note: This key can not already exist or it will throw an error.
     * Note: The key must not contain a period in it, an error will be thrown.
     *
     * @param key the name of the custom field
     * @param value the value of this custom field
     */
    addCustomField(key: string, value: any): IRoomExtender;

    /**
     * Adds a user to the room.
     *
     * @param user the user which is to be added to the room
     */
    addMember(user: IUser): IRoomExtender;

    /**
     * Get a list of users being added to the room.
     */
    getMembersBeingAdded(): Array<IUser>;

    /**
     * Get a list of usernames of users being added to the room.
     */
    getUsernamesOfMembersBeingAdded(): Array<string>;

    /**
     * Gets the resulting room that has been extended at the point of calling this.
     * Note: modifying the returned value will have no effect.
     */
    getRoom(): IRoom;
}

/**
 * Interface for building out a message.
 * Please note, that a room and sender must be associated otherwise you will NOT
 * be able to successfully save the message object.
 */
export interface IMessageBuilder {
    kind: RocketChatAssociationModel.MESSAGE;

    /**
     * Provides a convient way to set the data for the message.
     * Note: Providing an "id" field here will be ignored.
     *
     * @param message the message data to set
     */
    setData(message: IMessage): IMessageBuilder;

    /**
     * Sets the room where this message should be sent to.
     *
     * @param room the room where to send
     */
    setRoom(room: IRoom): IMessageBuilder;

    /**
     * Gets the room where this message was sent to.
     */
    getRoom(): IRoom;

    /**
     * Sets the sender of this message.
     *
     * @param sender the user sending the message
     */
    setSender(sender: IUser): IMessageBuilder;

    /**
     * Gets the User which sent the message.
     */
    getSender(): IUser;

    /**
     * Sets the text of the message.
     *
     * @param text the actual text
     */
    setText(text: string): IMessageBuilder;

    /**
     * Gets the message text.
     */
    getText(): string;

    /**
     * Sets the emoji to use for the avatar, this overwrites the current avatar
     * whether it be the user's or the avatar url provided.
     *
     * @param emoji the emoji code
     */
    setEmojiAvatar(emoji: string): IMessageBuilder;

    /**
     * Gets the emoji used for the avatar.
     */
    getEmojiAvatar(): string;

    /**
     * Sets the url which to display for the avatar, this overwrites the current
     * avatar whether it be the user's or an emoji one.
     *
     * @param avatarUrl image url to use as the avatar
     */
    setAvatarUrl(avatarUrl: string): IMessageBuilder;

    /**
     * Gets the url used for the avatar.
     */
    getAvatarUrl(): string;

    /**
     * Sets the display text of the sender's username that is visible.
     *
     * @param alias the username alias to display
     */
    setUsernameAlias(alias: string): IMessageBuilder;

    /**
     * Gets the display text of the sender's username that is visible.
     */
    getUsernameAlias(): string;

    /**
     * Adds one attachment to the message's list of attachments, this will not
     * overwrite any existing ones but just adds.
     *
     * @param attachment the attachment to add
     */
    addAttachment(attachment: IMessageAttachment): IMessageBuilder;

    /**
     * Sets the attachments for the message, replacing and destroying all of the current attachments.
     *
     * @param attachments array of the attachments
     */
    setAttachments(attachments: Array<IMessageAttachment>): IMessageBuilder;

    /**
     * Gets the attachments array for the message
     */
    getAttachments(): Array<IMessageAttachment>;

    /**
     * Replaces an attachment at the given position (index).
     * If there is no attachment at that position, there will be an error thrown.
     *
     * @param position the index of the attachment to replace
     * @param attachment the attachment to replace with
     */
    replaceAttachment(position: number, attachment: IMessageAttachment): IMessageBuilder;

    /**
     * Removes an attachment at the given position (index).
     * If there is no attachment at that position, there will be an error thrown.
     *
     * @param position the index of the attachment to remove
     */
    removeAttachment(position: number): IMessageBuilder;

    /**
     * Sets the user who is editing this message.
     * This is required if you are modifying an existing message.
     *
     * @param user the editor
     */
    setEditor(user: IUser): IMessageBuilder;

    /**
     * Gets the user who edited the message
     */
    getEditor(): IUser;

    /**
     * Sets whether this message can group with others.
     * This is desirable if you want to avoid confusion with other integrations.
     *
     * @param groupable whether this message can group with others
     */
    setGroupable(groupable: boolean): IMessageBuilder;

    /**
     * Gets whether this message can group with others.
     */
    getGroupable(): boolean;

    /**
     * Sets whether this message should have any URLs in the text
     * parsed by Rocket.Chat and get the details added to the message's
     * attachments.
     *
     * @param parseUrls whether URLs should be parsed in this message
     */
    setParseUrls(parseUrls: boolean): IMessageBuilder;

    /**
     * Gets whether this message should have its URLs parsed
     */
    getParseUrls(): boolean;

    /**
     * Gets the resulting message that has been built up to the point of calling it.
     *
     * *Note:* This will error out if the Room has not been defined.
     */
    getMessage(): IMessage;
}

/**
 * Interface for building out a livechat message.
 * Please note, that a room and sender must be associated otherwise you will NOT
 * be able to successfully save the message object.
 */
export interface ILivechatMessageBuilder {
    kind: RocketChatAssociationModel.LIVECHAT_MESSAGE;

    /**
     * Provides a convient way to set the data for the message.
     * Note: Providing an "id" field here will be ignored.
     *
     * @param message the message data to set
     */
    setData(message: ILivechatMessage): ILivechatMessageBuilder;

    /**
     * Sets the room where this message should be sent to.
     *
     * @param room the room where to send
     */
    setRoom(room: IRoom): ILivechatMessageBuilder;

    /**
     * Gets the room where this message was sent to.
     */
    getRoom(): IRoom;

    /**
     * Sets the sender of this message.
     *
     * @param sender the user sending the message
     */
    setSender(sender: IUser): ILivechatMessageBuilder;

    /**
     * Gets the User which sent the message.
     */
    getSender(): IUser;

    /**
     * Sets the text of the message.
     *
     * @param text the actual text
     */
    setText(text: string): ILivechatMessageBuilder;

    /**
     * Gets the message text.
     */
    getText(): string;

    /**
     * Sets the emoji to use for the avatar, this overwrites the current avatar
     * whether it be the user's or the avatar url provided.
     *
     * @param emoji the emoji code
     */
    setEmojiAvatar(emoji: string): ILivechatMessageBuilder;

    /**
     * Gets the emoji used for the avatar.
     */
    getEmojiAvatar(): string;

    /**
     * Sets the url which to display for the avatar, this overwrites the current
     * avatar whether it be the user's or an emoji one.
     *
     * @param avatarUrl image url to use as the avatar
     */
    setAvatarUrl(avatarUrl: string): ILivechatMessageBuilder;

    /**
     * Gets the url used for the avatar.
     */
    getAvatarUrl(): string;

    /**
     * Sets the display text of the sender's username that is visible.
     *
     * @param alias the username alias to display
     */
    setUsernameAlias(alias: string): ILivechatMessageBuilder;

    /**
     * Gets the display text of the sender's username that is visible.
     */
    getUsernameAlias(): string;

    /**
     * Adds one attachment to the message's list of attachments, this will not
     * overwrite any existing ones but just adds.
     *
     * @param attachment the attachment to add
     */
    addAttachment(attachment: IMessageAttachment): ILivechatMessageBuilder;

    /**
     * Sets the attachments for the message, replacing and destroying all of the current attachments.
     *
     * @param attachments array of the attachments
     */
    setAttachments(attachments: Array<IMessageAttachment>): ILivechatMessageBuilder;

    /**
     * Gets the attachments array for the message
     */
    getAttachments(): Array<IMessageAttachment>;

    /**
     * Replaces an attachment at the given position (index).
     * If there is no attachment at that position, there will be an error thrown.
     *
     * @param position the index of the attachment to replace
     * @param attachment the attachment to replace with
     */
    replaceAttachment(position: number, attachment: IMessageAttachment): ILivechatMessageBuilder;

    /**
     * Removes an attachment at the given position (index).
     * If there is no attachment at that position, there will be an error thrown.
     *
     * @param position the index of the attachment to remove
     */
    removeAttachment(position: number): ILivechatMessageBuilder;

    /**
     * Sets the user who is editing this message.
     * This is required if you are modifying an existing message.
     *
     * @param user the editor
     */
    setEditor(user: IUser): ILivechatMessageBuilder;

    /**
     * Gets the user who edited the message
     */
    getEditor(): IUser;

    /**
     * Sets whether this message can group with others.
     * This is desirable if you want to avoid confusion with other integrations.
     *
     * @param groupable whether this message can group with others
     */
    setGroupable(groupable: boolean): ILivechatMessageBuilder;

    /**
     * Gets whether this message can group with others.
     */
    getGroupable(): boolean;

    /**
     * Sets whether this message should have any URLs in the text
     * parsed by Rocket.Chat and get the details added to the message's
     * attachments.
     *
     * @param parseUrls whether URLs should be parsed in this message
     */
    setParseUrls(parseUrls: boolean): ILivechatMessageBuilder;

    /**
     * Gets whether this message should have its URLs parsed
     */
    getParseUrls(): boolean;

    /**
     * Set the token of the livechat visitor that
     * sent the message
     *
     * @param token The Livechat visitor's token
     */
    setToken(token: string): ILivechatMessageBuilder;

    /**
     * Gets the token of the livechat visitor that
     * sent the message
     */
    getToken(): string;

    /**
     * If the sender of the message is a Livechat Visitor,
     * set the visitor who sent the message.
     *
     * If you set the visitor property of a message, the
     * sender will be emptied
     *
     * @param visitor The visitor who sent the message
     */
    setVisitor(visitor: IVisitor): ILivechatMessageBuilder;

    /**
     * Get the visitor who sent the message,
     * if any
     */
    getVisitor(): IVisitor;

    /**
     * Gets the resulting message that has been built up to the point of calling it.
     *
     * *Note:* This will error out if the Room has not been defined OR if the room
     * is not of type RoomType.LIVE_CHAT.
     */
    getMessage(): ILivechatMessage;

    /**
     * Returns a message builder based on the
     * livechat message of this builder
     */
    getMessageBuilder(): IMessageBuilder;
}

/**
 * Interface for building out a room.
 * Please note, a room creator, name, and type must be set otherwise you will NOT
 * be able to successfully save the room object.
 */
export interface IRoomBuilder {
    kind: RocketChatAssociationModel.ROOM;

    /**
     * Provides a convient way to set the data for the room.
     * Note: Providing an "id" field here will be ignored.
     *
     * @param room the room data to set
     */
    setData(room: IRoom): IRoomBuilder;

    /**
     * Sets the display name of this room.
     *
     * @param name the display name of the room
     */
    setDisplayName(name: string): IRoomBuilder;

    /**
     * Gets the display name of this room.
     */
    getDisplayName(): string;

    /**
     * Sets the slugified name of this room, it must align to the rules of Rocket.Chat room
     * names otherwise there will be an error thrown (no spaces, special characters, etc).
     *
     * @param name the slugified name
     */
    setSlugifiedName(name: string): IRoomBuilder;

    /**
     * Gets the slugified name of this room.
     */
    getSlugifiedName(): string;

    /**
     * Sets the room's type.
     *
     * @param type the room type
     */
    setType(type: RoomType): IRoomBuilder;

    /**
     * Gets the room's type.
     */
    getType(): RoomType;

    /**
     * Sets the creator of the room.
     *
     * @param creator the user who created the room
     */
    setCreator(creator: IUser): IRoomBuilder;

    /**
     * Gets the room's creator.
     */
    getCreator(): IUser;

    /**
     * Adds a user to the room, these are by username until further notice.
     *
     * @param username the user's username to add to the room
     * @deprecated in favor of `addMemberByUsername`. This method will be removed on version 2.0.0
     */
    addUsername(username: string): IRoomBuilder;

    /**
     * Sets the usernames of who are joined to the room.
     *
     * @param usernames the list of usernames
     * @deprecated in favor of `setMembersByUsernames`. This method will be removed on version 2.0.0
     */
    setUsernames(usernames: Array<string>): IRoomBuilder;

    /**
     * Gets the usernames of users in the room.
     * @deprecated in favor of `getMembersUsernames`. This method will be removed on version 2.0.0
     */
    getUsernames(): Array<string>;

    /**
     * Adds a member to the room by username
     *
     * @param username the user's username to add to the room
     */
    addMemberToBeAddedByUsername(username: string): IRoomBuilder;

    /**
     * Sets a list of members to the room by usernames
     *
     * @param usernames the list of usernames
     */
    setMembersToBeAddedByUsernames(usernames: Array<string>): IRoomBuilder;

    /**
     * Gets the list of usernames of the members who are been added to the room
     */
    getMembersToBeAddedUsernames(): Array<string>;

    /**
     * Sets whether this room should be a default room or not.
     * This means that new users will automatically join this room
     * when they join the server.
     *
     * @param isDefault room should be default or not
     */
    setDefault(isDefault: boolean): IRoomBuilder;

    /**
     * Gets whether this room is a default room or not.
     */
    getIsDefault(): boolean;

    /**
     * Sets whether this room should be in read only state or not.
     * This means that users without the required permission to talk when
     * a room is muted will not be able to talk but instead will only be
     * able to read the contents of the room.
     *
     * @param isReadOnly whether it should be read only or not
     */
    setReadOnly(isReadOnly: boolean): IRoomBuilder;

    /**
     * Gets whether this room is on read only state or not.
     */
    getIsReadOnly(): boolean;

    /**
     * Sets whether this room should display the system messages (like user join, etc)
     * or not. This means that whenever a system event, such as joining or leaving, happens
     * then Rocket.Chat won't send the message to the channel.
     *
     * @param displaySystemMessages whether the messages should display or not
     */
    setDisplayingOfSystemMessages(displaySystemMessages: boolean): IRoomBuilder;

    /**
     * Gets whether this room should display the system messages or not.
     */
    getDisplayingOfSystemMessages(): boolean;

    /**
     * Adds a custom field to the room.
     * Note: This will replace an existing field with the same key should it exist already.
     *
     * @param key the name of the key
     * @param value the value of the custom field
     */
    addCustomField(key: string, value: object): IRoomBuilder;

    /**
     * Sets the entire custom field property to an object provided. This will overwrite
     * every existing key/values which are unrecoverable.
     *
     * @param fields the data to set
     */
    setCustomFields(fields: { [key: string]: object }): IRoomBuilder;

    /**
     * Gets the custom field property of the room.
     */
    getCustomFields(): { [key: string]: object };

    /**
     * Gets the resulting room that has been built up to the point of calling this method.
     * Note: modifying the returned value will have no effect.
     */
    getRoom(): IRoom;
}
