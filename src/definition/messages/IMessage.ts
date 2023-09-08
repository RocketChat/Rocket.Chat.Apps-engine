import type { Block } from '@rocket.chat/ui-kit';

import type { IRoom, RoomType } from '../rooms';
import type { IBlock } from '../uikit';
import type { IUser, IUserLookup } from '../users';
import type { IMessageAttachment } from './IMessageAttachment';
import type { IMessageFile } from './IMessageFile';
import type { IMessageReactions } from './IMessageReaction';

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
    blocks?: Array<IBlock | Block>;
    starred?: Array<{ _id: string }>;
    pinned?: boolean;
    pinnedAt?: Date;
    pinnedBy?: IUserLookup;
}

export interface IDirectMessage extends Omit<IMessage, 'room'> {
    room: Pick<IRoom, 'id' | 'creator'> & { type: RoomType.DIRECT_MESSAGE };
}
