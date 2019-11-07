
import { AppMethod } from '../../../src/definition/metadata';
import { ISlashCommand } from '../../../src/definition/slashcommands';

import { AppSlashCommand } from '../../../src/server/managers/AppSlashCommand';
import { ProxiedApp } from '../../../src/server/ProxiedApp';

let mockApp: ProxiedApp;

beforeAll(() =>  {
    mockApp = {
        hasMethod(method: AppMethod): boolean {
            return true;
        },
    } as ProxiedApp;
});

test('ensureAppSlashCommand', () => {
    expect(() => new AppSlashCommand(mockApp, {} as ISlashCommand)).not.toThrow();

    const ascr = new AppSlashCommand(mockApp, {} as ISlashCommand);
    expect(ascr.isRegistered).toBe(false);
    expect(ascr.isEnabled).toBe(false);
    expect(ascr.isDisabled).toBe(false);

    ascr.hasBeenRegistered();
    expect(ascr.isDisabled).toBe(false);
    expect(ascr.isEnabled).toBe(true);
    expect(ascr.isRegistered).toBe(true);

    expect(ascr.canBeRan(AppMethod._COMMAND_EXECUTOR)).toBe(true);
});
