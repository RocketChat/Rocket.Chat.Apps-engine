import { Block } from '@rocket.chat/ui-kit';

import { IMessageBuilder } from '@rocket.chat/apps-engine/definition/accessors/IMessageBuilder.ts';
import { RocketChatAssociationModel } from '@rocket.chat/apps-engine/definition/metadata/RocketChatAssociations.ts';
import { IMessage } from '@rocket.chat/apps-engine/definition/messages/IMessage.ts';
import { IMessageAttachment } from '@rocket.chat/apps-engine/definition/messages/IMessageAttachment.ts';
import { IUser } from '@rocket.chat/apps-engine/definition/users/IUser.ts';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms/IRoom.ts';
import { IBlock } from '@rocket.chat/apps-engine/definition/uikit/blocks/Blocks.ts';
import { BlockBuilder } from "./BlockBuilder.ts";

export class MessageBuilder implements IMessageBuilder {
    public kind: RocketChatAssociationModel.MESSAGE;

    private msg: IMessage;

    constructor(message?: IMessage) {
        this.kind = RocketChatAssociationModel.MESSAGE;
        this.msg = message || ({} as IMessage);
    }

    public setData(data: IMessage): IMessageBuilder {
        delete data.id;
        this.msg = data;

        return this as IMessageBuilder;
    }

    public setUpdateData(data: IMessage, editor: IUser): IMessageBuilder {
        this.msg = data;
        this.msg.editor = editor;
        this.msg.editedAt = new Date();

        return this as IMessageBuilder;
    }

    public setThreadId(threadId: string): IMessageBuilder {
        this.msg.threadId = threadId;

        return this as IMessageBuilder;
    }

    public getThreadId(): string {
        return this.msg.threadId!;
    }

    public setRoom(room: IRoom): IMessageBuilder {
        this.msg.room = room;
        return this as IMessageBuilder;
    }

    public getRoom(): IRoom {
        return this.msg.room;
    }

    public setSender(sender: IUser): IMessageBuilder {
        this.msg.sender = sender;
        return this as IMessageBuilder;
    }

    public getSender(): IUser {
        return this.msg.sender;
    }

    public setText(text: string): IMessageBuilder {
        this.msg.text = text;
        return this as IMessageBuilder;
    }

    public getText(): string {
        return this.msg.text!;
    }

    public setEmojiAvatar(emoji: string): IMessageBuilder {
        this.msg.emoji = emoji;
        return this as IMessageBuilder;
    }

    public getEmojiAvatar(): string {
        return this.msg.emoji!;
    }

    public setAvatarUrl(avatarUrl: string): IMessageBuilder {
        this.msg.avatarUrl = avatarUrl;
        return this as IMessageBuilder;
    }

    public getAvatarUrl(): string {
        return this.msg.avatarUrl!;
    }

    public setUsernameAlias(alias: string): IMessageBuilder {
        this.msg.alias = alias;
        return this as IMessageBuilder;
    }

    public getUsernameAlias(): string {
        return this.msg.alias!;
    }

    public addAttachment(attachment: IMessageAttachment): IMessageBuilder {
        if (!this.msg.attachments) {
            this.msg.attachments = [];
        }

        this.msg.attachments.push(attachment);
        return this as IMessageBuilder;
    }

    public setAttachments(attachments: Array<IMessageAttachment>): IMessageBuilder {
        this.msg.attachments = attachments;
        return this as IMessageBuilder;
    }

    public getAttachments(): Array<IMessageAttachment> {
        return this.msg.attachments!;
    }

    public replaceAttachment(position: number, attachment: IMessageAttachment): IMessageBuilder {
        if (!this.msg.attachments) {
            this.msg.attachments = [];
        }

        if (!this.msg.attachments[position]) {
            throw new Error(`No attachment found at the index of "${position}" to replace.`);
        }

        this.msg.attachments[position] = attachment;
        return this as IMessageBuilder;
    }

    public removeAttachment(position: number): IMessageBuilder {
        if (!this.msg.attachments) {
            this.msg.attachments = [];
        }

        if (!this.msg.attachments[position]) {
            throw new Error(`No attachment found at the index of "${position}" to remove.`);
        }

        this.msg.attachments.splice(position, 1);

        return this as IMessageBuilder;
    }

    public setEditor(user: IUser): IMessageBuilder {
        this.msg.editor = user;
        return this as IMessageBuilder;
    }

    public getEditor(): IUser {
        return this.msg.editor;
    }

    public setGroupable(groupable: boolean): IMessageBuilder {
        this.msg.groupable = groupable;
        return this as IMessageBuilder;
    }

    public getGroupable(): boolean {
        return this.msg.groupable!;
    }

    public setParseUrls(parseUrls: boolean): IMessageBuilder {
        this.msg.parseUrls = parseUrls;
        return this as IMessageBuilder;
    }

    public getParseUrls(): boolean {
        return this.msg.parseUrls!;
    }

    public getMessage(): IMessage {
        if (!this.msg.room) {
            throw new Error('The "room" property is required.');
        }

        return this.msg;
    }

    public addBlocks(blocks: BlockBuilder | Array<IBlock | Block>) {
        if (!Array.isArray(this.msg.blocks)) {
            this.msg.blocks = [];
        }

        if (blocks instanceof BlockBuilder) {
            this.msg.blocks.push(...blocks.getBlocks());
        } else {
            this.msg.blocks.push(...blocks);
        }

        return this as IMessageBuilder;
    }

    public setBlocks(blocks: BlockBuilder | Array<IBlock | Block>) {
        if (blocks instanceof BlockBuilder) {
            this.msg.blocks = blocks.getBlocks();
        } else {
            this.msg.blocks = blocks;
        }

        return this as IMessageBuilder;
    }

    public getBlocks() {
        return this.msg.blocks!;
    }

    public addCustomField(key: string, value: unknown): IMessageBuilder {
        if (!this.msg.customFields) {
            this.msg.customFields = {};
        }

        if (this.msg.customFields[key]) {
            throw new Error(`The message already contains a custom field by the key: ${key}`);
        }

        if (key.includes('.')) {
            throw new Error(`The given key contains a period, which is not allowed. Key: ${key}`);
        }

        this.msg.customFields[key] = value;

        return this as IMessageBuilder;
    }
}
