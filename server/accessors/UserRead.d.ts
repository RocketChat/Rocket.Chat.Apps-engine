import { IUserRead } from '../../definition/accessors';
import { IUser } from '../../definition/users';
import { IUserBridge } from '../bridges/IUserBridge';
export declare class UserRead implements IUserRead {
    private userBridge;
    private appId;
    constructor(userBridge: IUserBridge, appId: string);
    getById(id: string): Promise<IUser>;
    getByUsername(username: string): Promise<IUser>;
}
