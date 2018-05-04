import { IServerSettingsModify, ISlashCommandsModify } from '@rocket.chat/apps-ts-definition/accessors';
import { Expect, SetupFixture, Test } from 'alsatian';

import { ConfigurationModify } from '../../../src/server/accessors';

export class ConfigurationExtendTestFixture {
    private ssm: IServerSettingsModify;
    private scm: ISlashCommandsModify;

    @SetupFixture
    public setupFixture() {
        this.ssm = {} as IServerSettingsModify;
        this.scm = {} as ISlashCommandsModify;
    }

    @Test()
    public useConfigurationModify() {
        Expect(() => new ConfigurationModify(this.ssm, this.scm)).not.toThrow();

        const sm = new ConfigurationModify(this.ssm, this.scm);
        Expect(sm.serverSettings).toBeDefined();
        Expect(sm.slashCommands).toBeDefined();
    }
}
