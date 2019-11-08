import { InvalidLicenseError } from '../../../src/server/errors/InvalidLicenseError';
import { AppLicenseValidationResult } from '../../../src/server/marketplace/license';

test('verifyInvalidLicenseError', () => {
    const mockAppLicenseValidationResult: AppLicenseValidationResult = {} as AppLicenseValidationResult;
    const err = new InvalidLicenseError(mockAppLicenseValidationResult);

    expect(err.message).toBe('Invalid app license');
});
