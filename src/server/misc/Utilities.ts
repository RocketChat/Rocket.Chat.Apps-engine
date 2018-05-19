import cloneDeep = require('lodash.clonedeep');
import * as path from 'path';
import * as vm from 'vm';

import { ICompilerFile } from '../compiler';

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

    public static transformModuleForCustomRequire(moduleName: string): string {
        return path.normalize(moduleName).replace(/\.\.\//g, '') + '.ts';
    }

    public static buildCustomRequire(files: { [s: string]: ICompilerFile }): (mod: string) => {} {
        return function _requirer(mod: string): any {
            if (files[Utilities.transformModuleForCustomRequire(mod)]) {
                const ourExport = {};
                const context = vm.createContext({
                    require: Utilities.buildCustomRequire(files),
                    exports: ourExport,
                    process: {},
                });

                vm.runInContext(files[Utilities.transformModuleForCustomRequire(mod)].compiled, context);

                return ourExport;
            } else {
                return require(mod);
            }
        };
    }
}
