import { MustContainFunctionError } from '../../../src/server/errors';

test('verifyCompilerError', () => {
    const er = new MustContainFunctionError('App.ts', 'getVersion');

    expect(er.name).toBe('MustContainFunction');
    expect(er.message).toBe('The App (App.ts) doesn\'t have a "getVersion" function which is required.');
});
