import { Expect, SetupFixture, Test } from 'alsatian';

import { AppMethod } from '../../../src/definition/metadata';
import type { ISlashCommand } from '../../../src/definition/slashcommands';
import { AppSlashCommand } from '../../../src/server/managers/AppSlashCommand';
import type { ProxiedApp } from '../../../src/server/ProxiedApp';

export class AppSlashCommandRegistrationTestFixture {
	private mockApp: ProxiedApp;

	@SetupFixture
	public setupFixture() {
		this.mockApp = {
			hasMethod(method: AppMethod): boolean {
				return true;
			},
		} as ProxiedApp;
	}

	@Test()
	public ensureAppSlashCommand() {
		Expect(() => new AppSlashCommand(this.mockApp, {} as ISlashCommand)).not.toThrow();

		const ascr = new AppSlashCommand(this.mockApp, {} as ISlashCommand);
		Expect(ascr.isRegistered).toBe(false);
		Expect(ascr.isEnabled).toBe(false);
		Expect(ascr.isDisabled).toBe(false);

		ascr.hasBeenRegistered();
		Expect(ascr.isDisabled).toBe(false);
		Expect(ascr.isEnabled).toBe(true);
		Expect(ascr.isRegistered).toBe(true);

		Expect(ascr.canBeRan(AppMethod._COMMAND_EXECUTOR)).toBe(true);
	}
}
