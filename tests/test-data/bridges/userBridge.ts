import { IUser } from '../../../src/definition/users';

import { IUserBridge } from '../../../src/server/bridges';

export class TestsUserBridge implements IUserBridge {
    public getById(id: string, appId: string): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    public getByUsername(username: string, appId: string): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    public create(user: Partial<IUser>): Promise<string> {
        throw new Error('Method not implemented');
    }

    public getActiveUserCount(): Promise<number> {
        throw new Error('Method not implemented.');
    }

    public remove(user: IUser, appId: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    public getAppUser(appId?: string): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    public async update(user: IUser, updates: Partial<IUser>, appId: string): Promise<boolean> {
        throw new Error('Method not implemented');
    }
}
