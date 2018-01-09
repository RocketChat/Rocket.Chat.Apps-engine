import { IEnvironmentalVariableBridge } from '../../src/server/bridges/IEnvironmentalVariableBridge';

export class DevEnvironmentalVariableBridge implements IEnvironmentalVariableBridge {
    public getValueByName(envVarName: string, appId: string): string {
        throw new Error('Method not implemented.');
    }

    public isReadable(envVarName: string, appId: string): boolean {
        throw new Error('Method not implemented.');
    }

    public isSet(envVarName: string, appId: string): boolean {
        throw new Error('Method not implemented.');
    }
}
