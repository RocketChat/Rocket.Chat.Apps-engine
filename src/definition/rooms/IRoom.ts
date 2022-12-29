import { IUser } from '../users';
import { RoomType } from './RoomType';

export interface IRoom {
    id: string;
    displayName?: string;
    slugifiedName: string;
    type: RoomType;
    creator: IUser;
    userIds?: Array<string>;
    isDefault?: boolean;
    isReadOnly?: boolean;
    displaySystemMessages?: boolean;
    messageCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
    lastModifiedAt?: Date;
    description?: string;
    customFields?: { [key: string]: any };
    parentRoom?: IRoom;
    livechatData?: { [key: string]: any };
}
