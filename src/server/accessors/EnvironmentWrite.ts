import {
    IEnvironmentWrite,
    ISettingUpdater,
} from '../../definition/accessors';

export class EnvironmentWrite implements IEnvironmentWrite {
    constructor(private readonly settings: ISettingUpdater) {}

    public getSettings(): ISettingUpdater {
        return this.settings;
    }
}
