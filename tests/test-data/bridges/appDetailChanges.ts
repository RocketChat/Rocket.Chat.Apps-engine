import { ISetting } from '../../../src/definition/settings';

import { IAppDetailChangesBridge } from '../../../src/server/bridges';

export class TestsAppDetailChangesBridge implements IAppDetailChangesBridge {
    public onAppSettingsChange(appId: string, setting: ISetting): void {
        return;
    }
}
