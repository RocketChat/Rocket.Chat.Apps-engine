import { IMessageBuilder } from 'temporary-rocketlets-ts-definition/accessors';
import { IMessage, IMessageAttachment } from 'temporary-rocketlets-ts-definition/messages';
import { RocketChatAssociationModel } from 'temporary-rocketlets-ts-definition/metadata';
import { IRoom } from 'temporary-rocketlets-ts-definition/rooms';
import { IUser } from 'temporary-rocketlets-ts-definition/users';

export class MessageBuilder implements IMessageBuilder {
    public kind: RocketChatAssociationModel.MESSAGE;
    private msg: IMessage;

    constructor(message?: IMessage) {
        this.kind = RocketChatAssociationModel.MESSAGE;
        this.msg = message ? message : ({} as IMessage);
    }

    public setRoom(room: IRoom): IMessageBuilder {
        this.msg.room = room;
        return this;
    }

    public setSender(sender: IUser): IMessageBuilder {
        this.msg.sender = sender;
        return this;
    }

    public setText(text: string): IMessageBuilder {
        this.msg.text = text;
        return this;
    }

    public setEmojiAvatar(emoji: string): IMessageBuilder {
        this.msg.emoji = emoji;
        return this;
    }

    public setAvatarUrl(avatarUrl: string): IMessageBuilder {
        this.msg.avatar = avatarUrl;
        return this;
    }

    public setUsernameAlias(alias: string): IMessageBuilder {
        this.msg.alias = alias;
        return this;
    }

    public addAttachment(attachment: IMessageAttachment): IMessageBuilder {
        if (!this.msg.attachments) {
            this.msg.attachments = new Array<IMessageAttachment>();
        }

        this.msg.attachments.push(attachment);
        return this;
    }

    public setAttachments(attachments: Array<IMessageAttachment>): IMessageBuilder {
        this.msg.attachments = attachments;
        return this;
    }

    public replaceAttachment(position: number, attachment: IMessageAttachment): IMessageBuilder {
        if (!this.msg.attachments) {
            this.msg.attachments = new Array<IMessageAttachment>();
        }

        if (!this.msg.attachments[position]) {
            throw new Error(`No attachment found at the index of "${ position }" to replace.`);
        }

        this.msg.attachments[position] = attachment;
        return this;
    }

    public removeAttachment(position: number): IMessageBuilder {
        if (!this.msg.attachments) {
            this.msg.attachments = new Array<IMessageAttachment>();
        }

        if (!this.msg.attachments[position]) {
            throw new Error(`No attachment found at the index of "${ position }" to replace.`);
        }

        this.msg.attachments.splice(position, 1);

        return this;
    }

    public setUpdater(user: IUser): IMessageBuilder {
        this.msg.updater = user;
        return this;
    }

    public getMessage(): IMessage {
        return this.msg;
    }
}
