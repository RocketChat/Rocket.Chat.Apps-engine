import type { IUser } from '../users';
import type { RoomType } from './RoomType';

export interface IRoom {
    id: string;
    displayName?: string;
    slugifiedName: string;
    type: RoomType;
    creator: IUser;
    /**
     * @deprecated usernames will be removed on version 2.0.0
     */
    usernames: Array<string>;
    userIds?: Array<string>;
    isDefault?: boolean;
    isReadOnly?: boolean;
    displaySystemMessages?: boolean;
    messageCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
    lastModifiedAt?: Date;
    description?: string;
    /** @deprecated */
    customFields?: { [key: string]: any };
    custom?: ICustomFields;
    parentRoom?: IRoom;
    livechatData?: { [key: string]: any };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ICustomFields {}
