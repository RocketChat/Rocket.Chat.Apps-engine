import type { ISetting } from '../../../src/definition/settings';
import { ServerSettingBridge } from '../../../src/server/bridges';

export class TestsServerSettingBridge extends ServerSettingBridge {
	public getAll(appId: string): Promise<Array<ISetting>> {
		throw new Error('Method not implemented.');
	}

	public getOneById(id: string, appId: string): Promise<ISetting> {
		throw new Error('Method not implemented.');
	}

	public hideGroup(name: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	public hideSetting(id: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	public isReadableById(id: string, appId: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}

	public updateOne(setting: ISetting, appId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	public incrementValue(id: ISetting['id'], value: number, appId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
