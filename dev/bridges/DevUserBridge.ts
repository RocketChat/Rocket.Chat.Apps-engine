import { IUser } from '@rocket.chat/apps-ts-definition/users';

import { IUserBridge } from '../../src/server/bridges';

export class DevUserBridge implements IUserBridge {
    public getById(id: string, appId: string): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    public getByUsername(username: string, appId: string): Promise<IUser> {
        throw new Error('Method not implemented.');
    }
}
