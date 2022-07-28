import { NodeVM, NodeVMOptions } from "vm2";
import { App } from "../../definition/App";
import { AppStatus } from "../../definition/AppStatus";
import {
    AppsEngineRuntime,
    getFilenameForApp,
    IAppsEngineRuntimeOptions,
} from "./AppsEngineRuntime";

export class AppsEngineVM2Runtime extends AppsEngineRuntime {
    public static defaultNodeVMOptions: NodeVMOptions = {
        // console: 'inherit',
        // wrapper: 'none',
        // timeout: APPS_ENGINE_RUNTIME_DEFAULT_TIMEOUT,
        // we don't need any compiling happening
        compiler: (code: string, filename: string) => code,
        // We keep require inaccessible here as we expect it to be provided
        // require: false,
        // sandbox: {
        //     Buffer,
        //     ...timers,
        // },
    };

    public static runCode(
        code: string,
        sandbox?: Record<string, any>,
        options?: IAppsEngineRuntimeOptions
    ): any {

        const AppStatus = {
            UNKNOWN: 'unknown',
    /** The App has been constructed but that's it. */
            CONSTRUCTED: 'constructed',
            /** The App's `initialize()` was called and returned true. */
            INITIALIZED: 'initialized',
            /** The App's `onEnable()` was called, returned true, and this was done automatically (system start up). */
            AUTO_ENABLED: 'auto_enabled',
            /** The App's `onEnable()` was called, returned true, and this was done by the user such as installing a new one. */
            MANUALLY_ENABLED: 'manually_enabled',
            /**
             * The App was disabled due to an error while attempting to compile it.
             * An attempt to enable it again will fail, as it needs to be updated.
             */
            COMPILER_ERROR_DISABLED: 'compiler_error_disabled',
            /**
             * The App was disable due to its license being invalid
             */
            INVALID_LICENSE_DISABLED: 'invalid_license_disabled',
            /** The App was disabled due to an unrecoverable error being thrown. */
            ERROR_DISABLED: 'error_disabled',
            /** The App was manually disabled by a user. */
            MANUALLY_DISABLED: 'manually_disabled',
            INVALID_SETTINGS_DISABLED: 'invalid_settings_disabled',
            /** The App was disabled due to other circumstances. */
            DISABLED: 'disabled',
        }

        console.log("--------------------------runCode-----------------------");
        console.log(`[runCode] code`, code)
        const status = `var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
            function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
            return new (P || (P = Promise))(function (resolve, reject) {
                function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                step((generator = generator.apply(thisArg, _arguments || [])).next());
            });
        };
        Object.defineProperty(exports, "__esModule", { value: true });\nconst AppStatus_1 = ${JSON.stringify({AppStatus})};\n`;
        const app2 = status.concat(App.toString());
        const aaa = app2.concat(code);
        const a = aaa.replace(
            'require("@rocket.chat/apps-engine/definition/App")',
            "{ App }"
        );
        // AppStatus

        console.log(`[runCode] a`, a)

        // console.log(`[runCode] aaa`, a)
        // console.log(`runCode`, code.replace('require("@rocket.chat/apps-engine/definition/App")', '{ App }'))
        const vmOptions = {
            ...AppsEngineVM2Runtime.defaultNodeVMOptions,
            // timeout: options?.timeout,
            sandbox: {
                ...AppsEngineVM2Runtime.defaultNodeVMOptions.sandbox,
                ...(sandbox || {}),
                exports: true,
                require: true,
            },
            require: {
                external: {
                    modules: ['@rocket.chat/apps-engine/**/*'],
                    transitive: true,
                },
                builtin: ["*"],
                // import: [''],
                // import: ['@*'],
                // root: './',
            },
        };

        // console.log(`[runCode] vmOptions`, vmOptions);

        // vmOptions.require = {
        //     external: true,
        //     builtin: ['*'],
        //     // import: ['@rocket.chat/apps-engine'],
        // import: ['@rocket.chat/apps-engine'],
        //     // resolve: (moduleName, p) => (console.log(`Resolving ${moduleName} from ${p}`), moduleName),
        //     // customRequire: (...args) => (console.log(`Custom require called with ${args}`), sandbox.require(...args)),
        // };

        // tslint:disable-next-line: max-line-length
        // console.log(`[runCode] ran`, (new NodeVM(vmOptions)).run(code.replace('require("@rocket.chat/apps-engine/definition/App")', '{ App }'), 'node_modules'));

        return new NodeVM(vmOptions).run(a)
    }

    private vm: NodeVM;

    constructor(
        private readonly app: App,
        customRequire: (mod: string) => any
    ) {
        super(app, customRequire);

        this.vm = new NodeVM({
            ...AppsEngineVM2Runtime.defaultNodeVMOptions,
            require: { customRequire },
        });
    }

    public async runInSandbox(
        code: string,
        sandbox?: Record<string, any>,
        options?: IAppsEngineRuntimeOptions
    ): Promise<any> {
        sandbox ??= {};

        this.vm.setGlobals(sandbox);

        const result = await this.vm.run(code, {
            filename: getFilenameForApp(
                options?.filename || this.app.getName()
            ),
        });

        // Clean up the sandbox after the code has run
        this.vm.setGlobals(
            Object.keys(sandbox).reduce((acc, key) => {
                acc[key] = undefined;

                return acc;
            }, {} as typeof sandbox)
        );

        return result;
    }
}
