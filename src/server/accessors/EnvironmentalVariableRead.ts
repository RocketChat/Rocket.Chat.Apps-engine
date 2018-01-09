import { IEnvironmentalVariableBridge } from '../bridges';

import { IEnvironmentalVariableRead } from '@rocket.chat/apps-ts-definition/accessors';

export class EnvironmentalVariableRead implements IEnvironmentalVariableRead {
    constructor(private readonly bridge: IEnvironmentalVariableBridge, private readonly appId: string) {}

    public getValueByName(envVarName: string): string {
        return this.bridge.getValueByName(envVarName, this.appId);
    }

    public isReadable(envVarName: string): boolean {
        return this.bridge.isReadable(envVarName, this.appId);
    }

    public isSet(envVarName: string): boolean {
        return this.bridge.isSet(envVarName, this.appId);
    }
}
