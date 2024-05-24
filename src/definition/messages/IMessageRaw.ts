import type { IBlock, Block } from '@rocket.chat/ui-kit';

import type { IRoom } from '../rooms';
import type { IUser, IUserLookup } from '../users';
import type { IMessageAttachment } from './IMessageAttachment';
import type { IMessageFile } from './IMessageFile';
import type { IMessageReactions } from './IMessageReaction';

export interface IMessageRaw {
    id?: string;
    threadId?: string;
    room: Pick<IRoom, 'id'>;
    sender: Pick<IUser, 'id' | 'username'> & Partial<Pick<IUser, 'name'>>;
    text?: string;
    createdAt?: Date;
    updatedAt?: Date;
    editor?: Pick<IUser, 'id' | 'username'>;
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
    _unmappedProperties_?: Record<string, any>;
}
