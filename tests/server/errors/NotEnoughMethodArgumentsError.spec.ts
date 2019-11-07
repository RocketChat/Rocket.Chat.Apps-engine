import { NotEnoughMethodArgumentsError } from '../../../src/server/errors';

test('verifyCompilerError', () => {
    const er = new NotEnoughMethodArgumentsError('enable', 3, 1);

    expect(er.name).toBe('NotEnoughMethodArgumentsError');
    expect(er.message).toBe('The method "enable" requires 3 parameters but was only passed 1.');
});
