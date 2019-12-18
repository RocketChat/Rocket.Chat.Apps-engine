import { IRoom } from '../rooms';
import { IBlock } from '../uikit';
import { IUser } from '../users';
import { IMessageAttachment } from './IMessageAttachment';
import { IMessageFile } from './IMessageFile';
import { IMessageReactions } from './IMessageReaction';

export interface IMessage {
    id?: string;
    threadId?: string;
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
    blocks?: Array<IBlock>;
}
