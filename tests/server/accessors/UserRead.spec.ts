import { AsyncTest, Expect, SetupFixture } from 'alsatian';
import { IUser } from '../../../src/definition/users';

import { UserRead } from '../../../src/server/accessors';
import { IUserBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

export class UserReadAccessorTestFixture {
    private user: IUser;
    private mockUserBridge: IUserBridge;
    private mockAppId: 'test-appId';

    @SetupFixture
    public setupFixture() {
        this.user = TestData.getUser();

        const theUser = this.user;
        this.mockUserBridge = {
            getById(id, appId): Promise<IUser> {
                return Promise.resolve(theUser);
            },
            getByUsername(id, appId): Promise<IUser> {
                return Promise.resolve(theUser);
            },
            getAppUser(appId?: string): Promise<IUser> {
                return Promise.resolve(theUser);
            },
        } as IUserBridge;
    }

    @AsyncTest()
    public async expectDataFromMessageRead() {
        Expect(() => new UserRead(this.mockUserBridge, 'testing-app')).not.toThrow();

        const ur = new UserRead(this.mockUserBridge, 'testing-app');

        Expect(await ur.getById('fake')).toBeDefined();
        Expect(await ur.getById('fake')).toEqual(this.user);

        Expect(await ur.getByUsername('username')).toBeDefined();
        Expect(await ur.getByUsername('username')).toEqual(this.user);

        Expect(await ur.getAppUser(this.mockAppId)).toBeDefined();
        Expect(await ur.getAppUser(this.mockAppId)).toEqual(this.user);
        Expect(await ur.getAppUser()).toEqual(this.user);
    }
}
