import { ISetting } from '../../definition/settings';
import { BaseBridge } from './BaseBridge';

export abstract class AppDetailChangesBridge extends BaseBridge {
    public doOnAppSettingsChange(appId: string, setting: ISetting): void {
        return this.onAppSettingsChange(appId, setting);
    }

    protected abstract onAppSettingsChange(appId: string, setting: ISetting): void;
}
