import * as timers from 'timers';
import * as vm from 'vm';

import { App } from '../../definition/App';
import { APPS_ENGINE_RUNTIME_DEFAULT_TIMEOUT, AppsEngineRuntime, getFilenameForApp, IAppsEngineRuntimeOptions } from './AppsEngineRuntime';

export class AppsEngineNodeRuntime extends AppsEngineRuntime {
    public static defaultRuntimeOptions = {
        timeout: APPS_ENGINE_RUNTIME_DEFAULT_TIMEOUT,
    };

    public static defaultContext = {
        ...timers,
        Buffer,
        console,
        process: {},
        exports: {},
    };
    public static runCode(code: string, sandbox?: Record<string, any>, options?: IAppsEngineRuntimeOptions): any {
        return vm.runInNewContext(
            code,
            { ...AppsEngineNodeRuntime.defaultContext, ...sandbox },
            { ...AppsEngineNodeRuntime.defaultRuntimeOptions, ...options || {} },
        );
    }

    constructor(private readonly app: App, private readonly customRequire: (mod: string) => any) {
        super(app, customRequire);
    }

    public async runInSandbox(code: string, sandbox?: Record<string, any>, options?: IAppsEngineRuntimeOptions): Promise<any> {
        sandbox ??= {};

        const result = await vm.runInNewContext(code, {
            ...AppsEngineNodeRuntime.defaultContext,
            ...sandbox,
            require: this.customRequire,
        }, {
            ...AppsEngineNodeRuntime.defaultRuntimeOptions,
            filename: getFilenameForApp(options?.filename || this.app.getName()),
        });

        return result;
    }
}
