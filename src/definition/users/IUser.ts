import { IUserEmail } from './IUserEmail';
import { UserStatusConnection } from './UserStatusConnection';
import { UserType } from './UserType';

export interface IUser {
    id: string;
    username: string;
    name: string;
    roles: Array<string>;
    type: UserType;
    emails?: Array<IUserEmail>;
    isEnabled?: boolean;
    status?: string;
    statusConnection?: UserStatusConnection;
    utcOffset?: number;
    createdAt?: Date;
    updatedAt?: Date;
    lastLoginAt?: Date;
    // For app user
    appId?: string;
}
