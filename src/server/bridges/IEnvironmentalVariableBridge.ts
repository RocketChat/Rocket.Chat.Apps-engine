export interface IEnvironmentalVariableBridge {
    name: string;
    getValueByName(envVarName: string, appId: string): Promise<string>;

    isReadable(envVarName: string, appId: string): Promise<boolean>;

    isSet(envVarName: string, appId: string): Promise<boolean>;
}
