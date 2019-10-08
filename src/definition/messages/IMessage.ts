import { IRoom } from '../rooms';
import { IUser } from '../users';
import { IMessageAttachment } from './IMessageAttachment';
import { IMessageFile } from './IMessageFile';
import { IMessageReactions } from './IMessageReaction';

export interface IMessage {
    id?: string;
    room: IRoom;
    sender: IUser;
    text?: string;
    createdAt?: Date;
    updatedAt?: Date;
    editor?: IUser;
    editedAt?: Date;
    emoji?: string;
    avatarUrl?: string;
    alias?: string;
    file?: IMessageFile;
    attachments?: Array<IMessageAttachment>;
    reactions?: IMessageReactions;
    groupable?: boolean;
    parseUrls?: boolean;
    customFields?: { [key: string]: any };
}
