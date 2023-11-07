import * as child_process from 'child_process';
import * as path from 'path';
import { EventEmitter } from 'stream';

import * as jsonrpc from 'jsonrpc-lite';

import type { AppAccessorManager, AppApiManager } from '../managers';
import type { AppManager } from '../AppManager';
import { IEnvironmentRead, IEnvironmentWrite, IRead } from '../../definition/accessors';

export type AppRuntimeParams = {
    appId: string;
    appSource: string;
};

const ALLOWED_ACCESSOR_METHODS = [
    'getConfigurationExtend',
    'getEnvironmentRead',
    'getEnvironmentWrite',
    'getConfigurationModify',
    'getReader',
    'getPersistence',
    'getHttp',
] as Array<
    keyof Pick<
        AppAccessorManager,
        'getConfigurationExtend' | 'getEnvironmentRead' | 'getEnvironmentWrite' | 'getConfigurationModify' | 'getReader' | 'getPersistence' | 'getHttp'
    >
>;

function isValidOrigin(accessor: string): accessor is typeof ALLOWED_ACCESSOR_METHODS[number] {
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

type ControllerDeps = {
    accessors: AppAccessorManager;
    api: AppApiManager;
};

export class DenoRuntimeSubprocessController extends EventEmitter {
    private readonly deno: child_process.ChildProcess;

    private readonly options = {
        timeout: 10_000,
    };

    private state: 'uninitialized' | 'ready' | 'invalid' | 'unknown';

    private readonly accessors: AppAccessorManager;

    private readonly api: AppApiManager;

    // We need to keep the appSource around in case the Deno process needs to be restarted
    constructor(private readonly appId: string, private readonly appSource: string, deps: ControllerDeps) {
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

        this.accessors = deps.accessors;
        this.api = deps.api;
    }

    emit(eventName: string | symbol, ...args: any[]): boolean {
        console.debug(eventName, args);
        const hadListeners = super.emit(eventName, ...args);

        if (!hadListeners) {
            console.warn('Emitted but no one listened: ', eventName);
        }

        return hadListeners;
    }

    public getState() {
        return this.state;
    }

    public async setupApp() {
        await this.waitUntilReady();

        this.sendRequest({ method: 'construct', params: [this.appId, this.appSource] });
    }

    public async sendRequest(message: Pick<jsonrpc.RequestObject, 'method' | 'params'>): Promise<unknown> {
        const id = String(Math.random()).substring(2);

        this.deno.stdin.write(jsonrpc.request(id, message.method, message.params).serialize());

        return this.waitForResult(id);
    }

    private waitUntilReady(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.state === 'ready') {
                return resolve();
            }

            this.once('ready', resolve);

            setTimeout(() => reject(new Error('Timeout: app process not ready')), this.options.timeout);
        });
    }

    private waitForResult(id: string): Promise<unknown> {
        return new Promise((resolve, reject) => {
            this.once(`result:${id}`, (result: unknown[]) => resolve(result));

            setTimeout(() => reject(new Error('Request timed out')), this.options.timeout);
        });
    }

    private async onReady(): Promise<void> {
        this.state = 'ready';
    }

    private setupListeners(): void {
        this.deno.stdout.on('data', this.parseOutput.bind(this));
        this.deno.stderr.on('data', this.parseError.bind(this));

        this.on('ready', this.onReady.bind(this));
    }

    // Probable should extract this to a separate file
    private async handleAccessorMessage({ payload: { method, id, params } }: jsonrpc.IParsedObjectRequest): Promise<jsonrpc.SuccessObject> {
        const accessorMethods = method.substring(9).split(':'); // First 9 characters are always 'accessor:'
        const managerOrigin = accessorMethods.shift();
        const tailMethodName = accessorMethods.pop();

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
            throw new Error('Invalid accessor namespace');
        }

        // Need to fix typing of return value
        const getAccessorForOrigin = (
            accessorMethods: string[],
            managerOrigin: typeof ALLOWED_ACCESSOR_METHODS[number],
            accessorManager: AppAccessorManager,
        ) => {
            const origin = accessorManager[managerOrigin](this.appId);

            // These will need special treatment
            if (managerOrigin === 'getConfigurationExtend' || managerOrigin === 'getConfigurationModify') {
                return origin[accessorMethods[0] as keyof typeof origin];
            }

            if (managerOrigin === 'getHttp' || managerOrigin === 'getPersistence') {
                return origin;
            }

            let accessor = origin;

            // Call all intermediary objects to "resolve" the accessor
            accessorMethods.forEach((methodName) => {
                const method = accessor[methodName as keyof typeof accessor] as unknown;

                if (typeof method !== 'function') {
                    throw new Error('Invalid accessor method');
                }

                accessor = method.apply(accessor);
            });

            return accessor;
        };

        const accessor = getAccessorForOrigin(accessorMethods, managerOrigin, this.accessors);

        const tailMethod = accessor[tailMethodName as keyof typeof accessor] as unknown;

        if (typeof tailMethod !== 'function') {
            throw new Error('Invalid accessor method');
        }

        const result = await tailMethod.apply(accessor, params);

        return jsonrpc.success(id, result);
    }

    private async handleIncomingMessage(message: jsonrpc.IParsedObjectNotification | jsonrpc.IParsedObjectRequest): Promise<void> {
        const { method } = message.payload;

        if (method.startsWith('accessor:')) {
            const result = await this.handleAccessorMessage(message as jsonrpc.IParsedObjectRequest);

            this.deno.stdin.write(result.serialize());
        }

        switch (method) {
            case 'ready':
                this.emit('ready');
                break;
            default:
                console.warn('Unrecognized method from sub process');
                break;
        }
    }

    private async handleResultMessage(message: jsonrpc.IParsedObjectError | jsonrpc.IParsedObjectSuccess): Promise<void> {
        const { id } = message.payload;

        let param;

        if (message.type === 'success') {
            param = message.payload.result;
        } else {
            param = message.payload.error;
        }

        this.emit(`result:${id}`, param);
    }

    private async parseOutput(chunk: Buffer): Promise<void> {
        let message;

        try {
            message = jsonrpc.parse(chunk.toString());

            if (Array.isArray(message)) {
                throw new Error('Invalid message format');
            }

            if (message.type === 'request' || message.type === 'notification') {
                return this.handleIncomingMessage(message);
            }

            if (message.type === 'success' || message.type === 'error') {
                return this.handleResultMessage(message);
            }

            throw new Error();
        } catch {
            console.error('Invalid message format. What to do?', chunk.toString());
        } finally {
            console.log({ message });
        }
    }

    private async parseError(chunk: Buffer): Promise<void> {
        console.error(chunk.toString());
    }
}

type ExecRequestContext = {
    method: string;
    params: Record<string, unknown>;
    namespace?: string; // Use a namespace notation in the `method` property for this
};

export class AppsEngineDenoRuntime {
    private readonly subprocesses: Record<string, DenoRuntimeSubprocessController> = {};

    // private readonly accessorManager: AppAccessorManager;

    // private readonly apiManager: AppApiManager;

    // constructor(manager: AppManager) {
    //     this.accessorManager = manager.getAccessorManager();
    //     this.apiManager = manager.getApiManager();
    // }

    public async startRuntimeForApp({ appId, appSource }: AppRuntimeParams, options = { force: false }): Promise<void> {
        if (appId in this.subprocesses && !options.force) {
            throw new Error('App already has an associated runtime');
        }

        this.subprocesses[appId] = new DenoRuntimeSubprocessController(appId, appSource);

        await this.subprocesses[appId].setupApp();
    }

    public async runInSandbox(appId: string, execRequest: ExecRequestContext) {
        const subprocess = this.subprocesses[appId];

        if (!subprocess) {
            throw new Error('App does not have an associated runtime');
        }

        return subprocess.sendRequest(execRequest);
    }
}
