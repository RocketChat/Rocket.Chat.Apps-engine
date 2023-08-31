import * as path from 'path';

import { getRuntime } from '.';
import { AllowedInternalModules, requireNativeModule } from '../compiler/modules';

/**
 * Keeps compatibility with apps compiled and stored in the database
 * with previous Apps-Engine versions
 */
export function transformFallbackModuleForCustomRequire(moduleName: string): string {
    return `${path
        .normalize(moduleName)
        .replace(/\.\.?\//g, '')
        .replace(/^\//, '')}.ts`;
}

export function transformModuleForCustomRequire(moduleName: string): string {
    return `${path
        .normalize(moduleName)
        .replace(/\.\.?\//g, '')
        .replace(/^\//, '')}.js`;
}

export function allowedInternalModuleRequire(moduleName: string): moduleName is AllowedInternalModules {
    return moduleName in AllowedInternalModules;
}

export function buildCustomRequire(files: { [s: string]: string }, appId: string, currentPath = '.'): (mod: string, require: any) => {} {
    return function _requirer(mod: string, requirer: any) {
        // Keep compatibility with apps importing apps-ts-definition
        if (mod.startsWith('@rocket.chat/apps-ts-definition/')) {
            if (requirer) {
                return requirer(mod);
            }
            mod = path.normalize(mod);
            mod = mod.replace('@rocket.chat/apps-ts-definition/', '../../definition/');
            return globalThis.require(mod);
        }

        if (mod.startsWith('@rocket.chat/apps-engine/definition/')) {
            if (requirer) {
                return requirer(mod);
            }
            mod = path.normalize(mod);
            mod = mod.replace('@rocket.chat/apps-engine/definition/', '../../definition/');
            return globalThis.require(mod);
        }

        if (allowedInternalModuleRequire(mod)) {
            // TODO: Need to use the vm2 require in this function and evaluate the necessity of the proxies
            return requireNativeModule(mod, appId, requirer);
        }

        if (currentPath !== '.') {
            mod = path.join(currentPath, mod);
        }

        const transformedModule = transformModuleForCustomRequire(mod);
        const fallbackModule = transformFallbackModuleForCustomRequire(mod);

        const filename = (files[transformedModule] && transformedModule) || (files[fallbackModule] && fallbackModule) || undefined;

        if (!filename) {
            return;
        }

        const Runtime = getRuntime();

        // TODO: specify correct file name
        return Runtime.runCodeSync(
            files[filename],
            {
                require: buildCustomRequire(files, appId, `${path.dirname(filename)}/`),
            },
            {
                returnAllExports: true,
                filename,
            },
        );
    };
}
