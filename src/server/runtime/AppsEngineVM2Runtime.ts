import * as timers from 'timers';
import { NodeVM, NodeVMOptions } from 'vm2';
import { App } from '../../definition/App';
import { APPS_ENGINE_RUNTIME_DEFAULT_TIMEOUT, AppsEngineRuntime, getFilenameForApp, IAppsEngineRuntimeOptions } from './AppsEngineRuntime';

export class AppsEngineVM2Runtime extends AppsEngineRuntime {
    public static defaultNodeVMOptions: NodeVMOptions = {
        console: 'inherit',
        wrapper: 'none',
        timeout: APPS_ENGINE_RUNTIME_DEFAULT_TIMEOUT,
        // We keep require inaccessible here as we expect it to be provided
        // require: false,
        sandbox: {
            Buffer,
            ...timers,
        },
    };

    public static runCode(code: string, sandbox?: Record<string, any>, options?: IAppsEngineRuntimeOptions): any {
        NodeVM.code(code, options?.filename, {
            ...AppsEngineVM2Runtime.defaultNodeVMOptions,
            timeout: options?.timeout,
            sandbox: {
                ...AppsEngineVM2Runtime.defaultNodeVMOptions.sandbox,
                ...sandbox || {},
            },
        });
    }

    private vm: NodeVM;

    constructor(private readonly app: App, customRequire: (mod: string) => any) {
        super(app, customRequire);

        this.vm = new NodeVM({
            ...AppsEngineVM2Runtime.defaultNodeVMOptions,
            require: { customRequire },
        });
    }

    public async runInSandbox(code: string, sandbox?: Record<string, any>, options?: IAppsEngineRuntimeOptions): Promise<any> {
        sandbox ??= {};

        this.vm.setGlobals(sandbox);

        const result = await this.vm.run(code, {
            filename: getFilenameForApp(options?.filename || this.app.getName()),
        });

        // Clean up the sandbox after the code has run
        this.vm.setGlobals(Object.keys(sandbox).reduce((acc, key) => {
            acc[key] = undefined;

            return acc;
        }, {} as typeof sandbox));

        return result;
    }
}
