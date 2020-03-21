
import { IUser, UserType, IUserEmail, UserStatusConnection } from "../../definition/users";
import { AppManager } from '../AppManager';
export class User implements IUser {

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
    appId?: string;

    public constructor(user: IUser, private manager: AppManager) {
        Object.assign(this, user);
    }
}
