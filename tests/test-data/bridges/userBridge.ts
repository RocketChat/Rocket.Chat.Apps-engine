import { IUser } from '../../../src/definition/users';

import { IUserBridge } from '../../../src/server/bridges';

export class TestsUserBridge implements IUserBridge {
    public doGetById(id: string, appId: string): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    public doGetByUsername(username: string, appId: string): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    public doCreate(user: Partial<IUser>): Promise<string> {
        throw new Error('Method not implemented');
    }

    public doGetActiveUserCount(): Promise<number> {
        throw new Error('Method not implemented.');
    }

    public doRemove(user: IUser, appId: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    public doGetAppUser(appId?: string): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    public async doUpdate(user: IUser, updates: Partial<IUser>, appId: string): Promise<boolean> {
        throw new Error('Method not implemented');
    }
}
