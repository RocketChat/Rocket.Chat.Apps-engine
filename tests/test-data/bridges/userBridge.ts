import { IUser, IUserCreator } from '../../../src/definition/users';

import { IUserBridge } from '../../../src/server/bridges';

export class TestsUserBridge implements IUserBridge {
    public getById(id: string, appId: string): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    public getByUsername(username: string, appId: string): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    public create(user: IUserCreator): Promise<string> {
        throw new Error('Method not implemented');
    }

    public getActiveUserCount(): Promise<number> {
        throw new Error('Method not implemented.');
    }
}
