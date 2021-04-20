export interface IEnvironmentalVariableBridge {
    doGetValueByName(envVarName: string, appId: string): Promise<string>;
    doIsReadable(envVarName: string, appId: string): Promise<boolean>;
    doIsSet(envVarName: string, appId: string): Promise<boolean>;
}
