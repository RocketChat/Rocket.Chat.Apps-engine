import { Expect, SetupFixture, Test } from 'alsatian';
import { ISettingUpdater } from '../../../src/definition/accessors';
import { EnvironmentWrite } from '../../../src/server/accessors';

export class EnvironmentWriteTestFixture {
    private sr: ISettingUpdater;

    @SetupFixture
    public setupFixture() {
        this.sr = {} as ISettingUpdater;
    }

    @Test()
    public useEnvironmentWrite() {
        Expect(() => new EnvironmentWrite(this.sr)).not.toThrow();

        const er = new EnvironmentWrite(this.sr);
        Expect(er.getSettings()).toBeDefined();
    }
}
