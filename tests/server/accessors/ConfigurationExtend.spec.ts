import { IApiExtend, IHttpExtend, ISettingsExtend, ISlashCommandsExtend } from '../../../src/definition/accessors';

import { ConfigurationExtend } from '../../../src/server/accessors';

let he: IHttpExtend;
let se: ISettingsExtend;
let sce: ISlashCommandsExtend;
let api: IApiExtend;

beforeAll(() => {
    he = {} as IHttpExtend;
    se = {} as ISettingsExtend;
    sce = {} as ISlashCommandsExtend;
    api = {} as IApiExtend;
});

test('useConfigurationExtend', () => {
        expect(() => new ConfigurationExtend(he, se, sce, api)).not.toThrow();

        const ce = new ConfigurationExtend(he, se, sce, api);
        expect(ce.http).toBeDefined();
        expect(ce.settings).toBeDefined();
        expect(ce.slashCommands).toBeDefined();
});
