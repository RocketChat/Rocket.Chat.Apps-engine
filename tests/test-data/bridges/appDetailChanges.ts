import { ISetting } from '../../../src/definition/settings';

import { AppDetailChangesBridge } from '../../../src/server/bridges';

export class TestsAppDetailChangesBridge {
    public doOnAppSettingsChange(appId: string, setting: ISetting): void {
        return;
    }
}
