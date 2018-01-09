export interface IEnvironmentalVariableBridge {
    getValueByName(envVarName: string, appId: string): string;

    isReadable(envVarName: string, appId: string): boolean;

    isSet(envVarName: string, appId: string): boolean;
}
