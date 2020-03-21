import { IUser, IUserEmail, UserStatusConnection, UserType } from '../../definition/users';
export class User implements IUser {
    public id: string;
    public username: string;
    public emails: Array<IUserEmail>;
    public type: UserType;
    public isEnabled: boolean;
    public name: string;
    public roles: Array<string>;
    public status: string;
    public statusConnection: UserStatusConnection;
    public utcOffset: number;
    public createdAt: Date;
    public updatedAt: Date;
    public lastLoginAt: Date;
    public appId?: string;

    public constructor(user: IUser) {
        Object.assign(this, user);
    }
}
