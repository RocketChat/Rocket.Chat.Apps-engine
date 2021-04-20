import { ISetting } from '../../../src/definition/settings';

import { IAppDetailChangesBridge } from '../../../src/server/bridges';

export class TestsAppDetailChangesBridge implements IAppDetailChangesBridge {
    public doOnAppSettingsChange(appId: string, setting: ISetting): void {
        return;
    }
}
