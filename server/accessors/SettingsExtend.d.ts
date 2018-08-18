import { ProxiedApp } from '../ProxiedApp';
import { ISettingsExtend } from '../../definition/accessors';
import { ISetting } from '../../definition/settings';
export declare class SettingsExtend implements ISettingsExtend {
    private readonly app;
    constructor(app: ProxiedApp);
    provideSetting(setting: ISetting): Promise<void>;
}
