import { IUser } from '../users';
import { RoomType } from './RoomType';

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
    isDefault?: boolean;
    isReadOnly?: boolean;
    displaySystemMessages?: boolean;
    messageCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
    lastModifiedAt?: Date;
    customFields?: { [key: string]: any };
    parentRoom?: IRoom;
}
