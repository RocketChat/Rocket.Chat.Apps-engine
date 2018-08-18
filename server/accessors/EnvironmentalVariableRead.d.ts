import { IEnvironmentalVariableBridge } from '../bridges';
import { IEnvironmentalVariableRead } from '../../definition/accessors';
export declare class EnvironmentalVariableRead implements IEnvironmentalVariableRead {
    private readonly bridge;
    private readonly appId;
    constructor(bridge: IEnvironmentalVariableBridge, appId: string);
    getValueByName(envVarName: string): Promise<string>;
    isReadable(envVarName: string): Promise<boolean>;
    isSet(envVarName: string): Promise<boolean>;
}
