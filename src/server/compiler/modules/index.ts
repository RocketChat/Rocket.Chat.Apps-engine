import { netModuleHandler } from './net';

export enum AllowedInternalModules {
    path = 'path',
    url = 'url',
    crypto = 'crypto',
    buffer = 'buffer',
    stream = 'stream',
    net = 'net',
}

export class ForbiddenNativeModuleAccess extends Error {
    constructor(module: string, prop: string) {
        super(`Access to property ${prop} in module ${module} is forbidden`);
    }
}

const defaultHandler = () => ({});

const proxyHandlers = {
    path: defaultHandler,
    url: defaultHandler,
    crypto: defaultHandler,
    buffer: defaultHandler,
    stream: defaultHandler,
    net: netModuleHandler,
};

export function requireNativeModule(module: AllowedInternalModules, appId: string) {
    const requiredModule = require(module);

    return new Proxy(
        requiredModule,
        // Creates a proxy handler that is aware of the appId requiring the module
        Reflect.apply(proxyHandlers[module], undefined, [appId]),
    );
}
