import { CommandAlreadyExistsError } from '../../../src/server/errors';

test('verifyCommandAlreadyExistsError', () => {
    const er = new CommandAlreadyExistsError('testing');

    expect(er.name).toBe('CommandAlreadyExists');
    expect(er.message).toBe('The command "testing" already exists in the system.');
});
