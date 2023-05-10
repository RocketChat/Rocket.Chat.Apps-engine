import { Block } from '@rocket.chat/ui-kit';
import { IMessage, IMessageAttachment, IMessageFile, IMessageReactions } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
import { IUser, IUserLookup } from '../../definition/users';

export class Message implements IMessage {
    public id?: string;
    public sender: IUser;
    public text?: string;
    public createdAt?: Date;
    public updatedAt?: Date;
    public editor?: IUser;
    public editedAt?: Date;
    public emoji?: string;
    public avatarUrl?: string;
    public alias?: string;
    public attachments?: Array<IMessageAttachment>;
    public reactions?: IMessageReactions;
    public groupable?: boolean;
    public parseUrls?: boolean;
    public customFields?: { [key: string]: any };
    public threadId?: string;
    public room: IRoom;
    public file?: IMessageFile;
    public blocks?: Array<Block>;
    public starred?: Array<{ _id: string }>;
    public pinned?: boolean;
    public pinnedAt?: Date;
    public pinnedBy?: IUserLookup;

    public constructor(message: IMessage) {
        Object.assign(this, message);
    }

    get value(): object {
        return {
            id: this.id,
            sender: this.sender,
            text: this.text,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            editor: this.editor,
            editedAt: this.editedAt,
            emoji: this.emoji,
            avatarUrl: this.avatarUrl,
            alias: this.alias,
            attachments: this.attachments,
            reactions: this.reactions,
            groupable: this.groupable,
            parseUrls: this.parseUrls,
            customFields: this.customFields,
            threadId: this.threadId,
            room: this.room,
            file: this.file,
            blocks: this.blocks,
            starred: this.starred,
            pinned: this.pinned,
            pinnedAt: this.pinnedAt,
            pinnedBy: this.pinnedBy,
        };
    }

    public toJSON() {
        return this.value;
    }

    public toString() {
        return this.value;
    }

    public valueOf() {
        return this.value;
    }
}
