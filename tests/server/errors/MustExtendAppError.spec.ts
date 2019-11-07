import { MustExtendAppError } from '../../../src/server/errors';

test('verifyCompilerError', () => {
    const er = new MustExtendAppError();

    expect(er.name).toBe('MustExtendApp');
    expect(er.message).toBe('App must extend the "App" abstract class.');
});
