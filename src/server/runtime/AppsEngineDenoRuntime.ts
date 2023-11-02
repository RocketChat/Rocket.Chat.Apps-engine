import * as child_process from 'child_process';
import * as path from 'path';
import { EventEmitter } from 'stream';

import type { AppAccessorManager, AppApiManager } from '../managers';
import type { AppManager } from '../AppManager';

export type AppRuntimeParams = {
    appId: string;
    appSource: string;
};

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

    public async sendRequest(message: Record<string, unknown>): Promise<unknown> {
        const id = String(Math.random()).substring(2);

        this.deno.stdin.write(JSON.stringify({ id, ...message }));

        return this.waitForResult(id);
    }

    private waitUntilReady(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.state === 'ready') {
                return resolve();
            }

            this.once('ready', resolve);

            setTimeout(reject, this.options.timeout);
        });
    }

    private waitForResult(id: string): Promise<unknown> {
        return new Promise((resolve, reject) => {
            this.once(`result:${id}`, (result: unknown[]) => resolve(...result));

            setTimeout(reject, this.options.timeout);
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

    private async handleIncomingMessage(message: Record<string, unknown>): Promise<void> {
        const { method, id } = message;

        switch (method) {
            case 'ready':
                this.emit('ready');
                break;
            default:
                console.warn('Unrecognized method from sub process');
                break;
        }
    }

    private async handleResultMessage(message: Record<string, unknown>): Promise<void> {
        const { id, result } = message;

        this.emit(`result:${id}`, result);
    }

    private async parseOutput(chunk: Buffer): Promise<void> {
        let message;

        try {
            message = JSON.parse(chunk.toString());

            if ('method' in message) {
                return this.handleIncomingMessage(message);
            }

            if ('result' in message && 'id' in message) {
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

    private readonly accessorManager: AppAccessorManager;

    private readonly apiManager: AppApiManager;

    constructor(manager: AppManager) {
        this.accessorManager = manager.getAccessorManager();
        this.apiManager = manager.getApiManager();
    }

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
