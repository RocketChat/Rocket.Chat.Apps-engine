import { IServerSettingsModify, ISlashCommandsModify } from '../../../src/definition/accessors';

import { ConfigurationModify } from '../../../src/server/accessors';

let ssm: IServerSettingsModify;
let scm: ISlashCommandsModify;

beforeAll(() => {
    ssm = {} as IServerSettingsModify;
    scm = {} as ISlashCommandsModify;
});

test('useConfigurationModify', () => {
    expect(() => new ConfigurationModify(ssm, scm)).not.toThrow();

    const sm = new ConfigurationModify(ssm, scm);
    expect(sm.serverSettings).toBeDefined();
    expect(sm.slashCommands).toBeDefined();
});
