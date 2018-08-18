import { ProxiedApp } from '../ProxiedApp';
import { ISettingRead } from '../../definition/accessors';
import { ISetting } from '../../definition/settings';
export declare class SettingRead implements ISettingRead {
    private readonly app;
    constructor(app: ProxiedApp);
    getById(id: string): Promise<ISetting>;
    getValueById(id: string): Promise<any>;
}
