export interface IEnvironmentalVariableBridge {
    getValueByName(envVarName: string, appId: string): Promise<string>;
    doGetValueByName(envVarName: string, appId: string): Promise<string>;

    isReadable(envVarName: string, appId: string): Promise<boolean>;
    doIsReadable(envVarName: string, appId: string): Promise<boolean>;

    isSet(envVarName: string, appId: string): Promise<boolean>;
    doIsSet(envVarName: string, appId: string): Promise<boolean>;
}
