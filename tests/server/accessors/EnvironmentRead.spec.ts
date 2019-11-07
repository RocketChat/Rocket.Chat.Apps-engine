import { IEnvironmentalVariableRead, IServerSettingRead, ISettingRead } from '../../../src/definition/accessors';

import { EnvironmentRead } from '../../../src/server/accessors';

let evr: IEnvironmentalVariableRead;
let ssr: IServerSettingRead;
let sr: ISettingRead;

beforeAll(() => {
    evr = {} as IEnvironmentalVariableRead;
    ssr = {} as IServerSettingRead;
    sr = {} as ISettingRead;
});

test('useEnvironmentRead', () => {
    expect(() => new EnvironmentRead(sr, ssr, evr)).not.toThrow();

    const er = new EnvironmentRead(sr, ssr, evr);
    expect(er.getSettings()).toBeDefined();
    expect(er.getServerSettings()).toBeDefined();
    expect(er.getEnvironmentVariables()).toBeDefined();
});
