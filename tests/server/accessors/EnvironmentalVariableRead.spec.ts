import { EnvironmentalVariableRead } from '../../../src/server/accessors';
import { IEnvironmentalVariableBridge } from '../../../src/server/bridges';

let mockEnvVarBridge: IEnvironmentalVariableBridge;

beforeAll(() => {
    mockEnvVarBridge = {
        getValueByName(name: string, appId: string): Promise<string> {
            return Promise.resolve('value');
        },
        isReadable(name: string, appId: string): Promise<boolean> {
            return Promise.resolve(true);
        },
        isSet(name: string, appId: string): Promise<boolean> {
            return Promise.resolve(false);
        },
    } as IEnvironmentalVariableBridge;
});

test('useEnvironmentalVariableRead', async () => {
    expect(() => new EnvironmentalVariableRead(mockEnvVarBridge, 'testing')).not.toThrow();

    const evr = new EnvironmentalVariableRead(mockEnvVarBridge, 'testing');
    expect(await evr.getValueByName('testing')).toBe('value');
    expect(await evr.isReadable('testing')).toBeTruthy();
    expect(await evr.isSet('testing2')).not.toBeTruthy();
});
