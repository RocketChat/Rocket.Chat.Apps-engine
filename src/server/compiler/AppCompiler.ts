import * as path from 'path';

import type { App } from '../../definition/App';
import { AppMethod } from '../../definition/metadata';
import { AppAccessors } from '../accessors';
import type { AppManager } from '../AppManager';
import { MustContainFunctionError } from '../errors';
import { AppConsole } from '../logging';
import { ProxiedApp } from '../ProxiedApp';
import { getRuntime } from '../runtime';
import { buildCustomRequire } from '../runtime/require';
import type { IAppStorageItem } from '../storage';
import type { IParseAppPackageResult } from './IParseAppPackageResult';

export class AppCompiler {
    public normalizeStorageFiles(files: { [key: string]: string }): { [key: string]: string } {
        const result: { [key: string]: string } = {};

        Object.entries(files).forEach(([name, content]) => {
            result[name.replace(/\$/g, '.')] = content;
        });

        return result;
    }

    public async toSandBox(manager: AppManager, storage: IAppStorageItem, { files }: IParseAppPackageResult): Promise<ProxiedApp> {
        if (typeof files[path.normalize(storage.info.classFile)] === 'undefined') {
            throw new Error(`Invalid App package for "${storage.info.name}". Could not find the classFile (${storage.info.classFile}) file.`);
        }

        const Runtime = getRuntime();

        const customRequire = buildCustomRequire(files, storage.info.id);
        const result = await Runtime.runCode(files[path.normalize(storage.info.classFile)], {
            require: customRequire,
        });

        if (typeof result !== 'function') {
            throw new Error(`The App's main class for ${storage.info.name} is not valid ("${storage.info.classFile}").`);
        }
        const appAccessors = new AppAccessors(manager, storage.info.id);
        const logger = new AppConsole(AppMethod._CONSTRUCTOR);
        const rl = await Runtime.runCode(
            'exports.app = new App(info, rcLogger, appAccessors);',
            {
                rcLogger: logger,
                info: storage.info,
                App: result,
                appAccessors,
            },
            { timeout: 1000, filename: `App_${storage.info.nameSlug}.js` },
        );

        // TODO: app is importing the Class App internally so it's not same object to compare. Need to find a way to make this test
        // if (!(rl instanceof App)) {
        //     throw new MustExtendAppError();
        // }

        if (typeof rl.getName !== 'function') {
            throw new MustContainFunctionError(storage.info.classFile, 'getName');
        }

        if (typeof rl.getNameSlug !== 'function') {
            throw new MustContainFunctionError(storage.info.classFile, 'getNameSlug');
        }

        if (typeof rl.getVersion !== 'function') {
            throw new MustContainFunctionError(storage.info.classFile, 'getVersion');
        }

        if (typeof rl.getID !== 'function') {
            throw new MustContainFunctionError(storage.info.classFile, 'getID');
        }

        if (typeof rl.getDescription !== 'function') {
            throw new MustContainFunctionError(storage.info.classFile, 'getDescription');
        }

        if (typeof rl.getRequiredApiVersion !== 'function') {
            throw new MustContainFunctionError(storage.info.classFile, 'getRequiredApiVersion');
        }

        // TODO: Fix this type cast from to any to the right one
        const app = new ProxiedApp(manager, storage, rl as App, new Runtime(rl as App, customRequire as any));

        await manager.getLogStorage().storeEntries(AppConsole.toStorageEntry(app.getID(), logger));

        return app;
    }
}
