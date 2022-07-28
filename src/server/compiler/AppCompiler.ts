import * as path from "path";
import { VMScript } from "vm2";

import { App } from "../../definition/App";
import { AppMethod } from "../../definition/metadata";
import { AppAccessors } from "../accessors";
import { AppManager } from "../AppManager";
import { MustContainFunctionError, MustExtendAppError } from "../errors";
import { AppConsole } from "../logging";
import { ProxiedApp } from "../ProxiedApp";
import { getRuntime } from "../runtime";
import { buildCustomRequire } from "../runtime/require";
import { IAppStorageItem } from "../storage";
import { IParseAppPackageResult } from "./IParseAppPackageResult";

export class AppCompiler {
    public normalizeStorageFiles(files: { [key: string]: string }): {
        [key: string]: string;
    } {
        const result: { [key: string]: string } = {};

        Object.entries(files).forEach(([name, content]) => {
            result[name.replace(/\$/g, ".")] = content;
        });

        return result;
    }

    public toSandBox(
        manager: AppManager,
        storage: IAppStorageItem,
        { files }: IParseAppPackageResult
    ): ProxiedApp {
        console.log(
            `-----------------------------[toSandBox]-----------------------------`
        );
        // console.log(`[toSandBox] storage`, storage.id);
        if (
            typeof files[path.normalize(storage.info.classFile)] === "undefined"
        ) {
            throw new Error(
                `Invalid App package for "${storage.info.name}". ` +
                    `Could not find the classFile (${storage.info.classFile}) file.`
            );
        }

        const Runtime = getRuntime();

        const customRequire = buildCustomRequire(files, storage.info.id);
        // const app2 = App.toString()

        // console.log(`[toSandBox] app2`, app2)

        // console.log(`[toSandBox] customRequire`, customRequire);

        const appCode = files[path.normalize(storage.info.classFile)];
        const appAccessors = new AppAccessors(manager, storage.info.id);
        const logger = new AppConsole(AppMethod._CONSTRUCTOR);
        // const resultt = Runtime.runCode(appCode, { require: customRequire });
        const dalemanito = new VMScript(appCode);

        const uepa = Runtime.runCode(dalemanito.code, {
            require: customRequire
        });
        const className = storage.info.classFile.split(".")[0];

        // console.log(`[toSandBox] files[path.normalize(storage.info.classFile)]`, files[path.normalize(storage.info.classFile)])

        // const result = Runtime.runCode(files[path.normalize(storage.info.classFile)], {
        //     require: customRequire,

        // });

        // console.log(`[toSandBox] result`, result)

        // console.log(`[toSandBox] classFile`, storage.info.classFile);
        // console.log(`[toSandBox] className`, className);

        // console.log(`[toSandBox] result[className] 1`, result[className])
        // console.log(`[toSandBox] result[className] 2`, result[className].constructor.toString())
        // console.log(`[toSandBox] result[className] 3`, result[className].constructor.constructor.toString())

        // if (typeof resultt[className] !== 'function') {
        //     // tslint:disable-next-line:max-line-length
        //     throw new Error(`The App's main class for ${ storage.info.name } is not valid ("${ storage.info.classFile }").`);
        // }

        // console.log(`[toSandBox] code result[className]`, new result[className]())
        // console.log(`[toSandBox] runcode params`, {
        //     logger,
        //     info: storage.info.name,
        //     App: result[className].constructor.constructor,
        //     accessors: appAccessors,
        //     require: {
        //         context: 'host',
        //     },
        // })
        // let rl;
        // try {
        //     rl = Runtime.runCode(`new App(info, logger, accessors);`, {
        //         id: className,
        //         logger,
        //         info: storage.info,
        //         App: result[className].constructor.constructor,
        //         accessors: appAccessors,
        //         require: {
        //             context: 'host',
        //         },
        //     }, { timeout: 1000, filename: `App_${ storage.info.nameSlug }.js` }, `[toSandBox] rl`);
        //     console.log(`[toSandBox] rl UEEEEEEEEEEEPA`, rl)
        // } catch (error) {
        //     console.error(`[toSandBox] `, error)
        // }
        // console.log(`[toSandBox] resultt`, resultt[className].toString());

        // const appString = uepa[className]
        //     .toString()
        //     .replace("class", `class ${className}`);

        // const app3 = (App.toString().concat('\n const y = {App}\n').concat(appString));
        // console.log(`[toSandBox] resultt string`, app3);

        // const parsedApp = new Function(appString);

        // console.log(`[toSandBox] resultt parsed`, parsedApp.toString());
        console.log(`[toSandBox] CLASS PARSED`, uepa[className].toString());

        const newAppScript = `
        console.log({info, logger, accessors});
        const app = new App(info, logger, accessors);
        console.log('NEW APP INSIDE SANDBOX =>>>', app);
        console.log('INSIDE SANDBOX =>', app.getVersion());
        module.exports = app;
        `;

        const rl = Runtime.runCode(newAppScript, {
            id: className,
            logger,
            info: storage.info,
            App: uepa[className],
            accessors: appAccessors,
            require: {
                external: true,
                context: "host",
            },
        });

        console.log(
            `--------------------------rl------------------------------`
        );
        // console.log(`[toSandBox] rl`, rl);
        // console.log(`[toSandBox] rl string`, rl.toString());
        // console.log(`[toSandBox] rl function`, new Function(rl.toString()));

        // if (!(rl instanceof App)) {
        //     throw new MustExtendAppError();
        // }

        // if ((typeof rl as any).getName !== "function") {
        //     throw new MustContainFunctionError(
        //         storage.info.classFile,
        //         "getName"
        //     );
        // }

        // if ((typeof rl as any).getNameSlug !== "function") {
        //     throw new MustContainFunctionError(
        //         storage.info.classFile,
        //         "getNameSlug"
        //     );
        // }

        // if ((typeof rl as any).getVersion !== "function") {
        //     throw new MustContainFunctionError(
        //         storage.info.classFile,
        //         "getVersion"
        //     );
        // }

        // if ((typeof rl as any).getID !== "function") {
        //     throw new MustContainFunctionError(storage.info.classFile, "getID");
        // }

        // if ((typeof rl as any).getDescription !== "function") {
        //     throw new MustContainFunctionError(
        //         storage.info.classFile,
        //         "getDescription"
        //     );
        // }

        // if ((typeof rl as any).getRequiredApiVersion !== "function") {
        //     throw new MustContainFunctionError(
        //         storage.info.classFile,
        //         "getRequiredApiVersion"
        //     );
        // }

        const app = new ProxiedApp(
            manager,
            storage,
            rl as unknown as App,
            new Runtime(rl as unknown as App, customRequire) as any
        );
        // console.log(`[toSandBox] app`, app)
        // manager.getLogStorage().storeEntries(app.getID(), logger);
        // console.log(`[toSandBox] app`, app)
        // manager.getLogStorage().storeEntries(parsedApp.getID(), logger);

        return app;
    }
}
