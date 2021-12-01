import { EnvironmentalVariableBridge } from '../bridges';

import { IEnvironmentalVariableRead } from '../../definition/accessors';

export class EnvironmentalVariableRead implements IEnvironmentalVariableRead {
    constructor(private readonly bridge: EnvironmentalVariableBridge, private readonly appId: string) {}

    public getValueByName(envVarName: string): Promise<string> {
        return this.bridge.doGetValueByName(envVarName, this.appId);
    }

    public isReadable(envVarName: string): Promise<boolean> {
        return this.bridge.doIsReadable(envVarName, this.appId);
    }

    public isSet(envVarName: string): Promise<boolean> {
        return this.bridge.doIsSet(envVarName, this.appId);
    }
}
