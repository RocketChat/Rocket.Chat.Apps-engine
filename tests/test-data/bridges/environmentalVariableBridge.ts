import { EnvironmentalVariableBridge } from '../../../src/server/bridges/EnvironmentalVariableBridge';

export class TestsEnvironmentalVariableBridge {
    public doGetValueByName(envVarName: string, appId: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public doIsReadable(envVarName: string, appId: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    public doIsSet(envVarName: string, appId: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}
