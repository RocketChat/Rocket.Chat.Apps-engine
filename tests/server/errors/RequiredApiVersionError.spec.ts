import { IAppInfo } from '../../../src/definition/metadata';
import { RequiredApiVersionError } from '../../../src/server/errors';

test('verifyCompilerError', () => {
    const info = {
        requiredApiVersion: '1.0.1',
        name: 'Testing',
        id: 'fake-id',
    } as IAppInfo;
    const er = new RequiredApiVersionError(info, '1.0.0');

    expect(er.name).toBe('RequiredApiVersion');
    expect(er.message).toBe('Failed to load the App "Testing" (fake-id) as it requires v1.0.1 of the App API however your server comes with v1.0.0.');

    const er2 = new RequiredApiVersionError(info, '2.0.0');

    expect(er2.name).toBe('RequiredApiVersion');
    // tslint:disable-next-line:max-line-length
    expect(er2.message).toBe('Failed to load the App "Testing" (fake-id) as it requires v1.0.1 of the App API however your server comes with v2.0.0. Please tell the author to update their App as it is out of date.');
});
