import { TestFixture, Setup, SetupFixture, Expect, AsyncTest, SpyOn, Any } from 'alsatian';

import { AppAccessorManager, AppApiManager } from '../../../src/server/managers';
import { TestData, TestInfastructureSetup } from '../../test-data/utilities';
import { DenoRuntimeSubprocessController } from '../../../src/server/runtime/AppsEngineDenoRuntime';
import type { AppManager } from '../../../src/server/AppManager';
import { UserStatusConnection, UserType } from '../../../src/definition/users';
import { AppImplements } from '../../../src/server/compiler';

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

        this.controller = new DenoRuntimeSubprocessController(this.manager, {
            info: app.getInfo(),
            files: { 'main.ts': this.simpleAppSource },
            languageContent: {},
            implemented: new AppImplements(),
        });
    }

    @AsyncTest('correctly identifies a call to the HTTP accessor')
    public async testHttpAccessor() {
        const spy = SpyOn(this.manager.getBridges().getHttpBridge(), 'doCall');

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

        Expect(this.manager.getBridges().getHttpBridge().doCall).toHaveBeenCalledWith(
            Any(Object).thatMatches({
                appId: 'deno-controller',
                method: 'get',
                url: 'https://google.com',
            }),
        );

        Expect(r.result).toEqual({
            method: 'get',
            url: 'https://google.com',
            content: "{ test: 'test' }",
            statusCode: 200,
            headers: {},
        });

        spy.restore();
    }

    @AsyncTest('correctly identifies a call to the IRead accessor')
    public async testIReadAccessor() {
        const spy = SpyOn(this.manager.getBridges().getUserBridge(), 'doGetByUsername');

        spy.andReturn(
            Promise.resolve({
                id: 'id',
                username: 'rocket.cat',
                isEnabled: true,
                emails: [],
                name: 'name',
                roles: [],
                type: UserType.USER,
                active: true,
                utcOffset: 0,
                status: 'offline',
                statusConnection: UserStatusConnection.OFFLINE,
                lastLoginAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        );

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

        Expect(this.manager.getBridges().getUserBridge().doGetByUsername).toHaveBeenCalledWith('rocket.cat', 'deno-controller');

        Expect(id).toBe('test');
        Expect((result as any).username).toEqual('rocket.cat');
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

    @AsyncTest('correctly identifies a call to create a visitor via the LivechatCreator')
    public async testLivechatCreator() {
        const spy = SpyOn(this.manager.getBridges().getLivechatBridge(), 'doCreateVisitor');

        spy.andReturn(Promise.resolve('random id'));

        // eslint-disable-next-line
        const { id, result } = await this.controller['handleAccessorMessage']({
            type: 'request' as any,
            payload: {
                jsonrpc: '2.0',
                id: 'requestId',
                method: 'accessor:getModifier:getCreator:getLivechatCreator:createVisitor',
                params: [
                    {
                        id: 'random id',
                        token: 'random token',
                        username: 'random username for visitor',
                        name: 'Random Visitor',
                    },
                ],
                serialize: () => '',
            },
        });

        // Making sure `handleAccessorMessage` correctly identified which accessor it should resolve to
        // and that it passed the correct arguments to the bridge method
        Expect(this.manager.getBridges().getLivechatBridge().doCreateVisitor).toHaveBeenCalledWith(
            Any(Object).thatMatches({
                id: 'random id',
                token: 'random token',
                username: 'random username for visitor',
                name: 'Random Visitor',
            }),
            'deno-controller',
        );

        Expect(id).toBe('requestId');
        Expect(result).toEqual('random id');

        spy.restore();
    }

    @AsyncTest('correctly identifies a call to the message bridge')
    public async testMessageBridge() {
        const spy = SpyOn(this.manager.getBridges().getMessageBridge(), 'doCreate');

        spy.andReturn(Promise.resolve('random-message-id'));

        const messageParam = {
            room: { id: '123' },
            sender: { id: '456' },
            text: 'Hello World',
            alias: 'alias',
            avatarUrl: 'https://avatars.com/123',
        };

        // eslint-disable-next-line
        const { id, result } = await this.controller['handleBridgeMessage']({
            type: 'request' as any,
            payload: {
                jsonrpc: '2.0',
                id: 'requestId',
                method: 'bridges:getMessageBridge:doCreate',
                params: [messageParam, 'APP_ID'],
                serialize: () => '',
            },
        });

        Expect(this.manager.getBridges().getMessageBridge().doCreate).toHaveBeenCalledWith(messageParam, 'deno-controller');

        Expect(id).toBe('requestId');
        Expect(result).toEqual('random-message-id');

        spy.restore();
    }
}
