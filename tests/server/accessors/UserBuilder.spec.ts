import { Expect, Test } from 'alsatian';

import { UserBuilder } from '../../../src/server/accessors';
import { TestData } from '../../test-data/utilities';

export class UserBuilderAccessorTestFixture {

    @Test()
    public basicUserBuilder() {
        Expect(() => new UserBuilder()).not.toThrow();
        Expect(() => new UserBuilder(TestData.getUserCreator())).not.toThrow();
    }
}
