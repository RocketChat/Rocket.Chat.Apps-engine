import { IEnvironmentalVariableBridge } from '../../../src/server/bridges/IEnvironmentalVariableBridge';

export class TestsEnvironmentalVariableBridge implements IEnvironmentalVariableBridge {
    public name: 'TestsEnvironmentalVariableBridge';
    public getValueByName(envVarName: string, appId: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public isReadable(envVarName: string, appId: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    public isSet(envVarName: string, appId: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}
