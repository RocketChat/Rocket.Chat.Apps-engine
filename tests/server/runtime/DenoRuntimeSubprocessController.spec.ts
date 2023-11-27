import { TestFixture, Setup, SetupFixture, Expect, AsyncTest } from 'alsatian';

import { AppAccessorManager, AppApiManager } from '../../../src/server/managers';
import { TestData, TestInfastructureSetup } from '../../test-data/utilities';
import { DenoRuntimeSubprocessController } from '../../../src/server/runtime/AppsEngineDenoRuntime';
import type { AppManager } from '../../../src/server/AppManager';

@TestFixture('DenoRuntimeSubprocessController')
export class DenuRuntimeSubprocessControllerTestFixture {
    private simpleAppSource = 'module.exports={ default: new class { constructor() { this.name = "parangarico" } } };console.log("hi from app")';

    private manager: AppManager;

    private controller: DenoRuntimeSubprocessController;

    @SetupFixture
    public fixture() {
        const infrastructure = new TestInfastructureSetup();
        this.manager = infrastructure.getMockManager();

        const accessors = new AppAccessorManager(this.manager);

        this.manager.getAccessorManager = () => accessors;

        const api = new AppApiManager(this.manager);

        this.manager.getApiManager = () => api;
    }

    @Setup
    public setup() {
        const app = TestData.getMockApp('deno-controller', 'Deno Controller test');

        this.controller = new DenoRuntimeSubprocessController(app.getID(), this.simpleAppSource, this.manager);
    }

    @AsyncTest('correctly identifies a call to the HTTP accessor')
    public async testHttpAccessor() {
        // eslint-disable-next-line
        const r = await this.controller['handleAccessorMessage']({
            type: 'request' as any,
            payload: {
                jsonrpc: '2.0',
                id: 'test',
                method: 'accessor:getHttp:get',
                params: ['https://google.com', { content: "{ test: 'test' }" }],
                serialize: () => '',
            },
        });

        Expect(r.result).toEqual({
            method: 'get',
            url: 'https://google.com',
            content: "{ test: 'test' }",
            statusCode: 200,
            headers: {},
        });
    }

    @AsyncTest('correctly identifies a call to the IRead accessor')
    public async testIReadAccessor() {
        // eslint-disable-next-line
        const { id, result } = await this.controller['handleAccessorMessage']({
            type: 'request' as any,
            payload: {
                jsonrpc: '2.0',
                id: 'test',
                method: 'accessor:getReader:getUserReader:getByUsername',
                params: ['rocket.cat'],
                serialize: () => '',
            },
        });

        Expect(id).toBe('test');
        Expect((result as any).username).toEqual('rocket.cat');
        Expect((result as any).appId).toEqual('deno-controller');
    }

    @AsyncTest('correctly identifies a call to the IEnvironmentReader accessor via IRead')
    public async testIEnvironmentReaderAccessor() {
        // eslint-disable-next-line
        const { id, result } = await this.controller['handleAccessorMessage']({
            type: 'request' as any,
            payload: {
                jsonrpc: '2.0',
                id: 'requestId',
                method: 'accessor:getReader:getEnvironmentReader:getServerSettings:getOneById',
                params: ['setting test id'],
                serialize: () => '',
            },
        });

        Expect(id).toBe('requestId');
        Expect((result as any).id).toEqual('setting test id');
    }
}
