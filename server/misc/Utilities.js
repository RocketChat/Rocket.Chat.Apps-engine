"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloneDeep = require("lodash.clonedeep");
const path = require("path");
const vm = require("vm");
class Utilities {
    static deepClone(item) {
        return cloneDeep(item);
    }
    static deepFreeze(item) {
        Object.freeze(item);
        Object.getOwnPropertyNames(item).forEach((prop) => {
            // tslint:disable-next-line:max-line-length
            if (item.hasOwnProperty(prop) && item[prop] !== null && (typeof item[prop] === 'object' || typeof item[prop] === 'function') && !Object.isFrozen(item[prop])) {
                Utilities.deepFreeze(item[prop]);
            }
        });
        return item;
    }
    static deepCloneAndFreeze(item) {
        return Utilities.deepFreeze(Utilities.deepClone(item));
    }
    static transformModuleForCustomRequire(moduleName) {
        return path.normalize(moduleName).replace(/\.\.\//g, '') + '.ts';
    }
    static buildCustomRequire(files) {
        return function _requirer(mod) {
            // Keep compatibility with apps importing apps-ts-definition
            if (mod.startsWith('@rocket.chat/apps-ts-definition/')) {
                mod = path.normalize(mod);
                mod = mod.replace('@rocket.chat/apps-ts-definition/', '../../definition/');
            }
            else if (mod.startsWith('@rocket.chat/apps-engine/definition/')) {
                mod = path.normalize(mod);
                mod = mod.replace('@rocket.chat/apps-engine/definition/', '../../definition/');
            }
            if (files[Utilities.transformModuleForCustomRequire(mod)]) {
                const ourExport = {};
                const context = vm.createContext({
                    require: Utilities.buildCustomRequire(files),
                    exports: ourExport,
                    process: {},
                });
                vm.runInContext(files[Utilities.transformModuleForCustomRequire(mod)].compiled, context);
                return ourExport;
            }
            else {
                return require(mod);
            }
        };
    }
}
exports.Utilities = Utilities;

//# sourceMappingURL=Utilities.js.map
