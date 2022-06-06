import * as path from 'path';

import { App } from '../../definition/App';
import { AppMethod } from '../../definition/metadata';
import { AppAccessors } from '../accessors';
import { AppManager } from '../AppManager';
import { MustContainFunctionError, MustExtendAppError } from '../errors';
import { AppConsole } from '../logging';
import { ProxiedApp } from '../ProxiedApp';
import { getRuntime } from '../runtime';
import { buildCustomRequire } from '../runtime/require';
import { IAppStorageItem } from '../storage';
import { IParseAppPackageResult } from './IParseAppPackageResult';

export class AppCompiler {
    public normalizeStorageFiles(files: { [key: string]: string }): { [key: string]: string } {
        const result: { [key: string]: string } = {};

        Object.entries(files).forEach(([name, content]) => {
            result[name.replace(/\$/g, '.')] = content;
        });

        return result;
    }

    public toSandBox(manager: AppManager, storage: IAppStorageItem, { files }: IParseAppPackageResult): ProxiedApp {
        if (typeof files[path.normalize(storage.info.classFile)] === 'undefined') {
            throw new Error(`Invalid App package for "${ storage.info.name }". ` +
                `Could not find the classFile (${ storage.info.classFile }) file.`);
        }

        const Runtime = getRuntime();

        const customRequire = buildCustomRequire(files, storage.info.id);
        const result = Runtime.runCode(files[path.normalize(storage.info.classFile)], {
            require: customRequire,
        });

        if (typeof result !== 'function') {
            // tslint:disable-next-line:max-line-length
            throw new Error(`The App's main class for ${ storage.info.name } is not valid ("${ storage.info.classFile }").`);
        }

        const appAccessors = new AppAccessors(manager, storage.info.id);
        const logger = new AppConsole(AppMethod._CONSTRUCTOR);
        const rl = Runtime.runCode('new App(info, rcLogger, appAccessors);', {
            rcLogger: logger,
            info: storage.info,
            App: result,
            appAccessors,
        }, { timeout: 1000, filename: `App_${ storage.info.nameSlug }.js` });

        if (!(rl instanceof App)) {
            throw new MustExtendAppError();
        }

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

        const app = new ProxiedApp(manager, storage, rl as App, new Runtime(rl as App, customRequire));

        manager.getLogStorage().storeEntries(app.getID(), logger);

        return app;
    }
}
