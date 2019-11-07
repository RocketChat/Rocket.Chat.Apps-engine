import { CommandHasAlreadyBeenTouchedError } from '../../../src/server/errors';

test('verifyCommandHasAlreadyBeenTouched', () => {
    const er = new CommandHasAlreadyBeenTouchedError('testing');

    expect(er.name).toBe('CommandHasAlreadyBeenTouched');
    expect(er.message).toBe('The command "testing" has already been touched by another App.');
});
