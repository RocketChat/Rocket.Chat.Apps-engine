import { AsyncTest, Expect, SetupFixture } from 'alsatian';

import { EnvironmentalVariableRead } from '../../../src/server/accessors';
import { IEnvironmentalVariableBridge } from '../../../src/server/bridges';

export class EnvironmentalVariableReadAccessorTestFixture {
    private mockEnvVarBridge: IEnvironmentalVariableBridge;

    @SetupFixture
    public setupFixture() {
        this.mockEnvVarBridge = {
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
    }

    @AsyncTest()
    public async useEnvironmentalVariableRead() {
        Expect(() => new EnvironmentalVariableRead(this.mockEnvVarBridge, 'testing')).not.toThrow();

        const evr = new EnvironmentalVariableRead(this.mockEnvVarBridge, 'testing');
        Expect(await evr.getValueByName('testing')).toBe('value');
        Expect(await evr.isReadable('testing')).toBeTruthy();
        Expect(await evr.isSet('testing2')).not.toBeTruthy();
    }
}
