import { IUserEmail } from './IUserEmail';
import { UserStatusConnection } from './UserStatusConnection';
import { UserType } from './UserType';

export interface IUser {
    id: string;
    username: string;
    name: string;
    roles: Array<string>;
    type: UserType;
    status: string;
    statusConnection: UserStatusConnection;
    isEnabled: boolean;
    emails?: Array<IUserEmail>;
    utcOffset?: number;
    createdAt?: Date;
    updatedAt?: Date;
    lastLoginAt?: Date;
    // For app user
    appId?: string;
}
