import { Expect, Test } from 'alsatian';

import { IUserCreator } from '../../../src/definition/users';
import { UserBuilder } from '../../../src/server/accessors';
import { TestData } from '../../test-data/utilities';

export class UserBuilderAccessorTestFixture {
    @Test()
    public basicUserBuilder() {
        Expect(() => new UserBuilder()).not.toThrow();
        Expect(() => new UserBuilder(TestData.getUserCreator())).not.toThrow();
    }

    @Test()
    public settingOnUserBuilder() {
        const ubOnce = new UserBuilder();
        Expect(ubOnce.setData({ name: 'Test User', email: 'testuser@gmail.com', username: 'testuser'  } as IUserCreator)).toBe(ubOnce);
        Expect((ubOnce as any).room.displayName).toBe('Test User');
        Expect((ubOnce as any).room.username).toBe('testuser');
        Expect((ubOnce as any).room.email).toBe('testuser@gmail.com');

        const user: IUserCreator = {} as IUserCreator;
        const ub = new UserBuilder(user);

        Expect(ub.setEmail('testuser@gmail.com')).toBe(ub);
        Expect(user.email).toEqual('testuser@gmail.com');
        Expect(ub.getEmail()).toEqual('testuser@gmail.com');

        Expect(ub.setDisplayName('Test User')).toBe(ub);
        Expect(user.name).toEqual('Test User');
        Expect(ub.getDisplayName()).toEqual('Test User');

        Expect(ub.setUsername('testuser')).toBe(ub);
        Expect(user.username).toEqual('testuser');
        Expect(ub.getUsername()).toEqual('testuser');

        Expect(ub.setRoles(['bot'])).toBe(ub);
        Expect(user.roles).toEqual(['bot']);
        Expect(ub.getRoles()).toEqual(['bot']);

        Expect(ub.setActive(true)).toBe(ub);
        Expect(user.active).toEqual(true);
        Expect(ub.getActive()).toEqual(true);

        Expect(ub.setActive(false)).toBe(ub);
        Expect(user.active).toEqual(false);
        Expect(ub.getActive()).toEqual(false);

        Expect(ub.setJoinDefaultChannels(true)).toBe(ub);
        Expect(user.joinDefaultChannels).toEqual(true);
        Expect(ub.getJoinDefaultChannels()).toEqual(true);

        Expect(ub.setJoinDefaultChannels(false)).toBe(ub);
        Expect(user.joinDefaultChannels).toEqual(false);
        Expect(ub.getJoinDefaultChannels()).toEqual(false);

        Expect(ub.setVerified(true)).toBe(ub);
        Expect(user.verified).toEqual(true);
        Expect(ub.getVerified()).toEqual(true);

        Expect(ub.setVerified(false)).toBe(ub);
        Expect(user.verified).toEqual(false);
        Expect(ub.getVerified()).toEqual(false);

        Expect(ub.setRequirePasswordchange(true)).toBe(ub);
        Expect(user.requirePasswordChange).toEqual(true);
        Expect(ub.getRequirePasswordchange()).toEqual(true);

        Expect(ub.setRequirePasswordchange(false)).toBe(ub);
        Expect(user.requirePasswordChange).toEqual(false);
        Expect(ub.getRequirePasswordchange()).toEqual(false);

        Expect(ub.setSendWelcomeEmail(true)).toBe(ub);
        Expect(user.sendWelcomeEmail).toEqual(true);
        Expect(ub.getSendWelcomeEmail()).toEqual(true);

        Expect(ub.setSendWelcomeEmail(false)).toBe(ub);
        Expect(user.sendWelcomeEmail).toEqual(false);
        Expect(ub.getSendWelcomeEmail()).toEqual(false);

        Expect(ub.getUser()).toBe(ub);
    }
}
