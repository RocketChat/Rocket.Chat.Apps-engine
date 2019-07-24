import { IUser } from '../../../src/definition/users';

import { IUserBridge } from '../../../src/server/bridges';

export class TestsUserBridge implements IUserBridge {
    public getById(id: string, appId: string): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    public getByUsername(username: string, appId: string): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    public createBot(username: string, email: string, name: string, password: string): Promise<void>{
      throw new Error('Method not implemented');
    }

}
