
import { CompilerError } from '../../../src/server/errors';

test('verifyCompilerError', () => {
    const er = new CompilerError('syntax');

    expect(er.name).toBe('CompilerError');
    expect(er.message).toBe('An error occured while compiling an App: syntax');
});
