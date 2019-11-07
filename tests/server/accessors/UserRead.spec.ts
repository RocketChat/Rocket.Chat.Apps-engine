import { IUser } from '../../../src/definition/users';

import { UserRead } from '../../../src/server/accessors';
import { IUserBridge } from '../../../src/server/bridges';
import { TestData } from '../../test-data/utilities';

let user: IUser;
let mockUserBridge: IUserBridge;

beforeAll(() =>  {
    user = TestData.getUser();

    const theUser = user;
    mockUserBridge = {
        getById(id, appId): Promise<IUser> {
            return Promise.resolve(theUser);
        },
        getByUsername(id, appId): Promise<IUser> {
            return Promise.resolve(theUser);
        },
    } as IUserBridge;
});

test('expectDataFromMessageRead', async () => {
    expect(() => new UserRead(mockUserBridge, 'testing-app')).not.toThrow();

    const ur = new UserRead(mockUserBridge, 'testing-app');

    expect(await ur.getById('fake')).toBeDefined();
    expect(await ur.getById('fake')).toEqual(user);

    expect(await ur.getByUsername('username')).toBeDefined();
    expect(await ur.getByUsername('username')).toEqual(user);
});
