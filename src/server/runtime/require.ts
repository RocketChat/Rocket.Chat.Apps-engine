import * as path from 'path';
import { getRuntime } from '.';

import { AllowedInternalModules, requireNativeModule } from '../compiler/modules';

/**
 * Keeps compatibility with apps compiled and stored in the database
 * with previous Apps-Engine versions
 */
export function transformFallbackModuleForCustomRequire(moduleName: string): string {
    return path.normalize(moduleName).replace(/\.\.?\//g, '').replace(/^\//, '') + '.ts';
}

export function transformModuleForCustomRequire(moduleName: string): string {
    return path.normalize(moduleName).replace(/\.\.?\//g, '').replace(/^\//, '') + '.js';
}

export function allowedInternalModuleRequire(moduleName: string): moduleName is AllowedInternalModules {
    return moduleName in AllowedInternalModules;
}

export function buildCustomRequire(files: { [s: string]: string }, appId: string, currentPath: string = '.'): (mod: string) => {} {
    return function _requirer(mod: string, requirer?: any) {
        // Keep compatibility with apps importing apps-ts-definition
        if (mod.startsWith('@rocket.chat/apps-ts-definition/')) {
            if (requirer) {
                return requirer(mod);
            }
            mod = path.normalize(mod);
            mod = mod.replace('@rocket.chat/apps-ts-definition/', '../../definition/');
            return require(mod);
        }

        if (mod.startsWith('@rocket.chat/apps-engine/definition/')) {
            if (requirer) {
                return requirer(mod);
            }
            mod = path.normalize(mod);
            mod = mod.replace('@rocket.chat/apps-engine/definition/', '../../definition/');
            return require(mod);
        }

        if (allowedInternalModuleRequire(mod)) {
            return requireNativeModule(mod, appId);
        }

        if (currentPath !== '.') {
            mod = path.join(currentPath, mod);
        }

        const transformedModule = transformModuleForCustomRequire(mod);
        const fallbackModule = transformFallbackModuleForCustomRequire(mod);

        const filename = files[transformedModule] ? transformedModule : files[fallbackModule] ? fallbackModule : undefined;

        if (!filename) {
            return;
        }

        const Runtime = getRuntime();

        // TODO: specify correct file name
        return Runtime.runCode(files[filename], {
            require: buildCustomRequire(files, appId, path.dirname(filename) + '/'),
        }, {
            returnAllExports: true,
            filename,
        });
    };
}
