import * as timers from 'timers';
import { NodeVM, NodeVMOptions } from 'vm2';
import { App } from '../../definition/App';
import { APPS_ENGINE_RUNTIME_DEFAULT_TIMEOUT, AppsEngineRuntime, getFilenameForApp, IAppsEngineRuntimeOptions } from './AppsEngineRuntime';

export class AppsEngineVM2Runtime extends AppsEngineRuntime {
    public static defaultNodeVMOptions: NodeVMOptions = {
        console: 'inherit',
        // wrapper: 'none',
        timeout: APPS_ENGINE_RUNTIME_DEFAULT_TIMEOUT,
        // we don't need any compiling happening
        compiler: (code: string, filename: string) => code,
        // We keep require inaccessible here as we expect it to be provided
        // require: false,
        sandbox: {
            Buffer,
            ...timers,
        },
    };

    public static runCode(code: string, sandbox?: Record<string, any>, options?: IAppsEngineRuntimeOptions): any {
        const vmOptions = {
            ...AppsEngineVM2Runtime.defaultNodeVMOptions,
            timeout: options?.timeout,
            sandbox: {
                ...AppsEngineVM2Runtime.defaultNodeVMOptions.sandbox,
                ...sandbox || {},
            },
        };

        const resolve = sandbox.require;
        if (sandbox?.require instanceof Function) {
            vmOptions.require = {
                external: true,
                builtin: ['*'],
                resolve: (moduleName, p) => (console.log(`Resolving ${moduleName} from ${p}`), moduleName),
                context: 'sandbox',
            };

            delete sandbox.require;
        }

        const vm = new NodeVM(vmOptions);
        const app = (vm.run(code, {
            filename: options?.filename || 'app.js',
            // TODO: Missing type declaration. Only way to require modules manually
            require: (mod: string) => resolve(mod, vm.require.bind(vm)),
        }));
        // Get first exported object, vm2 does not return the last value when it's an assignment as intern vm
        // so we use the first exported value as the class.
        return options?.returnAllExports ? app : app && app[Object.keys(app)[0]];
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
