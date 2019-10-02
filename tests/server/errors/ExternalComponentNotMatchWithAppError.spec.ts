import { Expect, Test } from 'alsatian';
import { ExternalComponentNotMatchWithAppError } from '../../../src/server/errors/ExternalComponentNotMatchWithAppError';

export class ExternalComponentNotMatchWithAppErrorTestFixture {
    @Test()
    public verifyExternalComponentNotMatchWithAppErrorTestFixture() {
        const err = new ExternalComponentNotMatchWithAppError();

        Expect(err.name).toBe('ExternalComponentNotMatchWithApp');
        Expect(err.message).toBe('The external component\'s appId does not match with the current app.');
    }
}
