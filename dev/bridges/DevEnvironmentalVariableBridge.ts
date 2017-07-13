import { IEnvironmentalVariableBridge } from '../../src/server/bridges/IEnvironmentalVariableBridge';

export class DevEnvironmentalVariableBridge implements IEnvironmentalVariableBridge {
    public getValueByName(envVarName: string, rocketletId: string): string {
        throw new Error('Method not implemented.');
    }

    public isReadable(envVarName: string, rocketletId: string): boolean {
        throw new Error('Method not implemented.');
    }

    public isSet(envVarName: string, rocketletId: string): boolean {
        throw new Error('Method not implemented.');
    }
}
