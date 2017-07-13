export interface IEnvironmentalVariableBridge {
    getValueByName(envVarName: string, rocketletId: string): string;

    isReadable(envVarName: string, rocketletId: string): boolean;

    isSet(envVarName: string, rocketletId: string): boolean;
}
