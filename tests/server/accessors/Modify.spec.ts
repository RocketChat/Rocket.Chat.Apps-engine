import { Expect, Test } from 'alsatian';

import {  Modify } from '../../../src/server/accessors';
import { AppBridges } from '../../../src/server/bridges';

export class ModifyAccessorTestFixture {
    @Test()
    public useModify() {
        Expect(() => new Modify({} as AppBridges, 'testing')).not.toThrow();

        const md = new Modify({} as AppBridges, 'testing');
        Expect(md.getCreator()).toBeDefined();
        Expect(md.getExtender()).toBeDefined();
        Expect(md.getNotifer()).toBeDefined();
        Expect(md.getUpdater()).toBeDefined();
    }
}
