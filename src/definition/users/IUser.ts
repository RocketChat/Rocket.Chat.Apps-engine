import { IUserEmail } from './IUserEmail';
import { UserStatusConnection } from './UserStatusConnection';
import { UserType } from './UserType';

export interface IUser {
    id: string;
    username: string;
    emails: Array<IUserEmail>;
    type: UserType;
    isEnabled: boolean;
    name: string;
    roles: Array<string>;
    bio?: string;
    status: string;
    statusConnection: UserStatusConnection;
    statusText?: string;
    utcOffset: number;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date;
    userPreferredLanguage?: string;
    appId?: string;
    customFields?: { [key: string]: any };
}
