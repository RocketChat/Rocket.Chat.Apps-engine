import { IEnvironmentalVariableBridge } from '../bridges';

import { IEnvironmentalVariableRead } from 'temporary-rocketlets-ts-definition/accessors';

export class EnvironmentalVariableRead implements IEnvironmentalVariableRead {
    constructor(private readonly bridge: IEnvironmentalVariableBridge, private readonly rocketletId: string) {}

    public getValueByName(envVarName: string): string {
        return this.bridge.getValueByName(envVarName, this.rocketletId);
    }

    public isReadable(envVarName: string): boolean {
        return this.bridge.isReadable(envVarName, this.rocketletId);
    }

    public isSet(envVarName: string): boolean {
        return this.bridge.isSet(envVarName, this.rocketletId);
    }
}
