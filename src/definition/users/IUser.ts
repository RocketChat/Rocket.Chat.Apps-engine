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
    status: string;
    statusConnection: UserStatusConnection;
    utcOffset: number;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date;
}
