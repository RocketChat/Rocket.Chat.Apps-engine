import * as child_process from 'child_process';
import * as path from 'path';
import { type Readable, EventEmitter } from 'stream';

import * as jsonrpc from 'jsonrpc-lite';
import { Decoder, Encoder, ExtensionCodec } from '@msgpack/msgpack';

import type { AppManager } from '../AppManager';
import type { AppLogStorage } from '../storage';
import type { AppBridges } from '../bridges';
import type { IParseAppPackageResult } from '../compiler';
import type { AppAccessorManager, AppApiManager } from '../managers';
import type { ILoggerStorageEntry } from '../logging';
import type { AppRuntimeManager } from '../managers/AppRuntimeManager';
import { AppStatus } from '../../definition/AppStatus';

export const ALLOWED_ACCESSOR_METHODS = [
    'getConfigurationExtend',
    'getEnvironmentRead',
    'getEnvironmentWrite',
    'getConfigurationModify',
    'getReader',
    'getPersistence',
    'getHttp',
    'getModifier',
] as Array<
    keyof Pick<
        AppAccessorManager,
        | 'getConfigurationExtend'
        | 'getEnvironmentRead'
        | 'getEnvironmentWrite'
        | 'getConfigurationModify'
        | 'getReader'
        | 'getPersistence'
        | 'getHttp'
        | 'getModifier'
    >
>;

const extensionCodec = new ExtensionCodec();

extensionCodec.register({
    type: 0,
    encode: (object: unknown) => {
        // We don't care about functions, but also don't want to throw an error
        if (typeof object === 'function') {
            return new Uint8Array([0]);
        }
    },
    decode: (_data: Uint8Array) => undefined,
});

// We need to handle Buffers because Deno needs its own decoding
extensionCodec.register({
    type: 1,
    encode: (object: unknown) => {
        if (object instanceof Buffer) {
            return new Uint8Array(object.buffer, object.byteOffset, object.byteLength);
        }
    },
    // By passing byteOffset and byteLength, we're creating a view of the original buffer instead of copying it
    decode: (data: Uint8Array) => Buffer.from(data.buffer, data.byteOffset, data.byteLength),
});

const encoder = new Encoder({ extensionCodec });
const decoder = new Decoder({ extensionCodec });

export const JSONRPC_METHOD_NOT_FOUND = -32601;

export function isValidOrigin(accessor: string): accessor is typeof ALLOWED_ACCESSOR_METHODS[number] {
    return ALLOWED_ACCESSOR_METHODS.includes(accessor as any);
}

/**
 * Resolves the absolute path of the Deno executable
 * installed by deno-bin.
 */
export function getDenoExecutablePath(): string {
    // require.resolve returns correctly even after Meteor's bundle magic
    return path.join(path.dirname(require.resolve('deno-bin')), 'bin', 'deno');
}

export function getDenoWrapperPath(): string {
    try {
        // This path is relative to the compiled version of the Apps-Engine source
        return require.resolve('../../deno-runtime/main.ts');
    } catch {
        // This path is relative to the original Apps-Engine files
        return require.resolve('../../../deno-runtime/main.ts');
    }
}

export class DenoRuntimeSubprocessController extends EventEmitter {
    private readonly deno: child_process.ChildProcess;

    private readonly options = {
        timeout: 10000,
    };

    private state: 'uninitialized' | 'ready' | 'invalid' | 'unknown' | 'stopped';

    private readonly accessors: AppAccessorManager;

    private readonly api: AppApiManager;

    private readonly logStorage: AppLogStorage;

    private readonly bridges: AppBridges;

    private readonly runtimeManager: AppRuntimeManager;

    // We need to keep the appSource around in case the Deno process needs to be restarted
    constructor(manager: AppManager, private readonly appPackage: IParseAppPackageResult) {
        super();

        this.state = 'uninitialized';

        try {
            const denoExePath = getDenoExecutablePath();
            const denoWrapperPath = getDenoWrapperPath();
            const denoWrapperDir = path.dirname(path.join(denoWrapperPath, '..'));

            this.deno = child_process.spawn(denoExePath, ['run', `--allow-read=${denoWrapperDir}/`, denoWrapperPath, '--subprocess']);

            this.setupListeners();
        } catch {
            this.state = 'invalid';
        }

        this.accessors = manager.getAccessorManager();
        this.api = manager.getApiManager();
        this.logStorage = manager.getLogStorage();
        this.bridges = manager.getBridges();
        this.runtimeManager = manager.getRuntime();
    }

    // Debug purposes, could be deleted later
    emit(eventName: string | symbol, ...args: any[]): boolean {
        const hadListeners = super.emit(eventName, ...args);

        if (!hadListeners) {
            console.warn('Emitted but no one listened: ', eventName, args);
        }

        return hadListeners;
    }

    public getProcessState() {
        return this.state;
    }

    public async getStatus(): Promise<AppStatus> {
        // If the process has been terminated, we can't get the status
        if (this.deno.exitCode !== null) {
            return AppStatus.UNKNOWN;
        }
        return this.sendRequest({ method: 'app:getStatus', params: [] }) as Promise<AppStatus>;
    }

    public async setupApp() {
        await this.waitUntilReady();

        await this.sendRequest({ method: 'app:construct', params: [this.appPackage] });
    }

    public stopApp() {
        if (this.deno.killed) {
            return true;
        }

        // What else should we do?
        if (!this.deno.kill('SIGKILL')) {
            return false;
        }

        this.state = 'stopped';

        this.runtimeManager.stopRuntime(this);

        return true;
    }

    public getAppId(): string {
        return this.appPackage.info.id;
    }

    private send(message: jsonrpc.JsonRpc) {
        this.deno.stdin.write(encoder.encode(message));
    }

    public async sendRequest(message: Pick<jsonrpc.RequestObject, 'method' | 'params'>): Promise<unknown> {
        const id = String(Math.random().toString(36)).substring(2);

        const request = jsonrpc.request(id, message.method, message.params);

        const promise = this.waitForResponse(request);

        this.send(request);

        return promise;
    }

    private waitUntilReady(): Promise<void> {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => reject(new Error('Timeout: app process not ready')), this.options.timeout);

            if (this.state === 'ready') {
                clearTimeout(timeoutId);
                return resolve();
            }

            this.once('ready', () => {
                clearTimeout(timeoutId);
                return resolve();
            });
        });
    }

    private waitForResponse(req: jsonrpc.RequestObject): Promise<unknown> {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => reject(new Error(`Request "${req.id}" for method "${req.method}" timed out`)), this.options.timeout);

            this.once(`result:${req.id}`, (result: unknown, error: jsonrpc.IParsedObjectError['payload']['error']) => {
                clearTimeout(timeoutId);

                if (error) {
                    reject(error);
                }

                resolve(result);
            });
        });
    }

    private onReady(): void {
        this.state = 'ready';
    }

    private setupListeners(): void {
        this.deno.stderr.on('data', this.parseError.bind(this));
        this.on('ready', this.onReady.bind(this));
        this.parseStdout(this.deno.stdout);
    }

    // Probable should extract this to a separate file
    private async handleAccessorMessage({ payload: { method, id, params } }: jsonrpc.IParsedObjectRequest): Promise<jsonrpc.SuccessObject> {
        const accessorMethods = method.substring(9).split(':'); // First 9 characters are always 'accessor:'
        const managerOrigin = accessorMethods.shift();
        const tailMethodName = accessorMethods.pop();

        if (managerOrigin === 'api' && tailMethodName === 'listApis') {
            const result = this.api.listApis(this.appPackage.info.id);

            return jsonrpc.success(id, result);
        }

        /**
         * At this point, the accessorMethods array will contain the path to the accessor from the origin (AppAccessorManager)
         * The accessor is the one that contains the actual method the app wants to call
         *
         * Most of the times, it will take one step from origin to accessor
         * For example, for the call AppAccessorManager.getEnvironmentRead().getServerSettings().getValueById() we'll have
         * the following:
         *
         * ```
         * const managerOrigin = 'getEnvironmentRead'
         * const tailMethod = 'getValueById'
         * const accessorMethods = ['getServerSettings']
         * ```
         *
         * But sometimes there can be more steps, like in the following example:
         * AppAccessorManager.getReader().getEnvironmentReader().getEnvironmentVariables().getValueByName()
         * In this case, we'll have:
         *
         * ```
         * const managerOrigin = 'getReader'
         * const tailMethod = 'getValueByName'
         * const accessorMethods = ['getEnvironmentReader', 'getEnvironmentVariables']
         * ```
         **/
        // Prevent app from trying to get properties from the manager that
        // are not intended for public access
        if (!isValidOrigin(managerOrigin)) {
            throw new Error(`Invalid accessor namespace "${managerOrigin}"`);
        }

        // Need to fix typing of return value
        const getAccessorForOrigin = (
            accessorMethods: string[],
            managerOrigin: typeof ALLOWED_ACCESSOR_METHODS[number],
            accessorManager: AppAccessorManager,
        ) => {
            const origin = accessorManager[managerOrigin](this.appPackage.info.id);

            if (managerOrigin === 'getHttp' || managerOrigin === 'getPersistence') {
                return origin;
            }

            if (managerOrigin === 'getConfigurationExtend' || managerOrigin === 'getConfigurationModify') {
                return origin[accessorMethods[0] as keyof typeof origin];
            }

            let accessor = origin;

            // Call all intermediary objects to "resolve" the accessor
            accessorMethods.forEach((methodName) => {
                const method = accessor[methodName as keyof typeof accessor] as unknown;

                if (typeof method !== 'function') {
                    throw new Error(`Invalid accessor method "${methodName}"`);
                }

                accessor = method.apply(accessor);
            });

            return accessor;
        };

        const accessor = getAccessorForOrigin(accessorMethods, managerOrigin, this.accessors);

        const tailMethod = accessor[tailMethodName as keyof typeof accessor] as unknown;

        if (typeof tailMethod !== 'function') {
            throw new Error(`Invalid accessor method "${tailMethodName}"`);
        }

        const result = await tailMethod.apply(accessor, params);

        return jsonrpc.success(id, typeof result === 'undefined' ? null : result);
    }

    private async handleBridgeMessage({ payload: { method, id, params } }: jsonrpc.IParsedObjectRequest): Promise<jsonrpc.SuccessObject> {
        const [bridgeName, bridgeMethod] = method.substring(8).split(':');

        const bridge = this.bridges[bridgeName as keyof typeof this.bridges];

        if (!bridgeMethod.startsWith('do') || typeof bridge !== 'function' || !Array.isArray(params)) {
            throw new Error('Invalid bridge request');
        }

        const bridgeInstance = bridge.call(this.bridges);

        const methodRef = bridgeInstance[bridgeMethod as keyof typeof bridge] as unknown;

        if (typeof methodRef !== 'function') {
            throw new Error('Invalid bridge request');
        }

        const result = await methodRef.apply(
            bridgeInstance,
            // Should the protocol expect the placeholder APP_ID value or should the Deno process send the actual appId?
            // If we do not expect the APP_ID, the Deno process will be able to impersonate other apps, potentially
            params.map((value: unknown) => (value === 'APP_ID' ? this.appPackage.info.id : value)),
        );

        return jsonrpc.success(id, typeof result === 'undefined' ? null : result);
    }

    private async handleIncomingMessage(message: jsonrpc.IParsedObjectNotification | jsonrpc.IParsedObjectRequest): Promise<void> {
        const { method } = message.payload;

        if (method.startsWith('accessor:')) {
            const result = await this.handleAccessorMessage(message as jsonrpc.IParsedObjectRequest);

            this.send(result);

            return;
        }

        if (method.startsWith('bridges:')) {
            const result = await this.handleBridgeMessage(message as jsonrpc.IParsedObjectRequest);

            this.send(result);

            return;
        }

        switch (method) {
            case 'ready':
                this.emit('ready');
                break;
            case 'log':
                console.log('SUBPROCESS LOG', message);
                break;
            default:
                console.warn('Unrecognized method from sub process');
                break;
        }
    }

    private async handleResultMessage(message: jsonrpc.IParsedObjectError | jsonrpc.IParsedObjectSuccess): Promise<void> {
        const { id } = message.payload;

        let result: unknown;
        let error: jsonrpc.IParsedObjectError['payload']['error'] | undefined;
        let logs: ILoggerStorageEntry;

        if (message.type === 'success') {
            const params = message.payload.result as { value: unknown; logs?: ILoggerStorageEntry };
            result = params.value;
            logs = params.logs;
        } else {
            error = message.payload.error;
            logs = message.payload.error.data?.logs as ILoggerStorageEntry;
        }

        // Should we try to make sure all result messages have logs?
        if (logs) {
            await this.logStorage.storeEntries(logs);
        }

        this.emit(`result:${id}`, result, error);
    }

    private async parseStdout(stream: Readable): Promise<void> {
        for await (const message of decoder.decodeStream(stream)) {
            try {
                const JSONRPCMessage = jsonrpc.parseObject(message);

                if (Array.isArray(JSONRPCMessage)) {
                    throw new Error('Invalid message format');
                }

                if (JSONRPCMessage.type === 'request' || JSONRPCMessage.type === 'notification') {
                    this.handleIncomingMessage(JSONRPCMessage).catch((reason) => console.error('Error executing handler', reason, message));
                    continue;
                }

                if (JSONRPCMessage.type === 'success' || JSONRPCMessage.type === 'error') {
                    this.handleResultMessage(JSONRPCMessage).catch((reason) => console.error('Error executing handler', reason, message));
                    continue;
                }

                console.error('Unrecognized message type', JSONRPCMessage);
            } catch (e) {
                // SyntaxError is thrown when the message is not a valid JSON
                if (e instanceof SyntaxError) {
                    console.error('Failed to parse message');
                    continue;
                }

                console.error('Error executing handler', e, message);
            }
        }
    }

    private async parseError(chunk: Buffer): Promise<void> {
        console.error('Subprocess stderr', chunk.toString());
    }
}
