import cloneDeep = require('lodash.clonedeep');
import * as path from 'path';
import * as vm from 'vm';

import { AllowedInternalModules, requireNativeModule } from '../compiler/modules';

export class Utilities {
    public static deepClone<T>(item: T): T {
        return cloneDeep(item);
    }

    public static deepFreeze<T>(item: any): T {
        Object.freeze(item);

        Object.getOwnPropertyNames(item).forEach((prop: string) => {
            // tslint:disable-next-line:max-line-length
            if (item.hasOwnProperty(prop) && item[prop] !== null && (typeof item[prop] === 'object' || typeof item[prop] === 'function') && !Object.isFrozen(item[prop])) {
                Utilities.deepFreeze(item[prop]);
            }
        });

        return item;
    }

    public static deepCloneAndFreeze<T>(item: T): T {
        return Utilities.deepFreeze(Utilities.deepClone(item));
    }

    /**
     * Keeps compatibility with apps compiled and stored in the database
     * with previous Apps-Engine versions
     */
    public static transformFallbackModuleForCustomRequire(moduleName: string): string {
        return path.normalize(moduleName).replace(/\.\.?\//g, '').replace(/^\//, '') + '.ts';
    }

    public static transformModuleForCustomRequire(moduleName: string): string {
        return path.normalize(moduleName).replace(/\.\.?\//g, '').replace(/^\//, '') + '.js';
    }

    public static allowedInternalModuleRequire(moduleName: string): moduleName is AllowedInternalModules {
        return moduleName in AllowedInternalModules;
    }

    public static buildCustomRequire(files: { [s: string]: string }, appId: string, currentPath: string = '.'): (mod: string) => {} {
        return function _requirer(mod: string): any {
            // Keep compatibility with apps importing apps-ts-definition
            if (mod.startsWith('@rocket.chat/apps-ts-definition/')) {
                mod = path.normalize(mod);
                mod = mod.replace('@rocket.chat/apps-ts-definition/', '../../definition/');
                return require(mod);
            }

            if (mod.startsWith('@rocket.chat/apps-engine/definition/')) {
                mod = path.normalize(mod);
                mod = mod.replace('@rocket.chat/apps-engine/definition/', '../../definition/');
                return require(mod);
            }

            if (Utilities.allowedInternalModuleRequire(mod)) {
                return requireNativeModule(mod, appId);
            }

            if (currentPath !== '.') {
                mod = path.join(currentPath, mod);
            }

            const transformedModule = Utilities.transformModuleForCustomRequire(mod);
            const fallbackModule = Utilities.transformFallbackModuleForCustomRequire(mod);

            const filename = files[transformedModule] ? transformedModule : files[fallbackModule] ? fallbackModule : undefined;
            let fileExport;

            if (filename) {
                fileExport = {};

                const context = vm.createContext({
                    require: Utilities.buildCustomRequire(files, appId, path.dirname(filename) + '/'),
                    console,
                    exports: fileExport,
                    process: {},
                });

                vm.runInContext(files[filename], context);
            }

            return fileExport;
        };
    }

    public static omit(object: { [key: string]: any }, keys: Array<string>) {
        const cloned = this.deepClone(object);
        for (const key of keys) {
            delete cloned[key];
        }
        return cloned;
    }
}
