import { AsyncTest, Expect, Setup, SetupFixture, Test, TestCase, TestFixture } from 'alsatian';

import type { App } from '../../definition/App';
import { AppsEngineVM2Runtime } from './AppsEngineVM2Runtime';

@TestFixture('AppsEngineVM2Runtine')
export class AppsEngineVM2RuntineTestFixture {
    private app = {
        getName: () => 'app-name',
    };

    @SetupFixture
    public setupFixture() {}

    @Setup
    public setup() {}

    @TestCase(
        `module.exports = () => { return 'Hello World First case'};`,
        { someSandbox: true },
        {
            timeout: 10,
            filename: 'filename.ts',
            returnAllExports: true,
        },
        'Hello World First case',
    )
    @TestCase(
        `module.exports = { method: () => { return 'Hello World Second case' } }`,
        null,
        {
            timeout: 10,
            returnAllExports: false,
        },
        'Hello World Second case',
    )
    @TestCase(`module.exports = () => { return 'Hello World Third case'};`, { someSandbox: true }, null, 'Hello World Third case')
    @TestCase(`module.exports = () => { return 'Hello World Fourth case'};`, null, null)
    @TestCase(`module.exports = () => { return 'Hello World Fifth case'};`, { require: () => 'module' }, null, 'Hello World Fourth case')
    @Test('AppsEngineVM2Runtime.runCode')
    public runCodeTest(...args: any) {
        const code = args[0];
        const sandbox = args[1];
        const options = args[2];
        const response = args[3];

        const result = AppsEngineVM2Runtime.runCode(code, sandbox, options);

        if (result) {
            if (result instanceof Function) {
                Expect(result()).toBe(response);
            }
        }
    }

    @TestCase(
        `module.exports = () => { return 'Hello World'};`,
        { someSandbox: true },
        {
            timeout: 10,
            filename: 'filename.ts',
            returnAllExports: true,
        },
        'Hello World',
    )
    @AsyncTest('new AppsEngineVM2Runtime().runInSandbox(code, sandbox, options)')
    public async runInSandbox(...args: any) {
        const code = args[0];
        const sandbox = args[1];
        const options = args[2];
        const response = args[3];

        const instance = new AppsEngineVM2Runtime(this.app as App, (mod: string) => mod);

        const result = await instance.runInSandbox(code, sandbox, options);

        Expect(result()).toBe(response);
    }
}
