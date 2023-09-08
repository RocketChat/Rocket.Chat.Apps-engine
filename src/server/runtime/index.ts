import { AppsEngineDenoRuntime } from './AppsEngineDenoRuntime';
import { AppsEngineNodeRuntime } from './AppsEngineNodeRuntime';
import { AppsEngineVM2Runtime } from './AppsEngineVM2Runtime';

export type AvailableRuntime = typeof AppsEngineNodeRuntime | typeof AppsEngineVM2Runtime;

export function _getRuntime(requiredEnv = 'vm2'): AvailableRuntime {
    switch (requiredEnv) {
        case 'vm2':
            return AppsEngineVM2Runtime;
        default:
            return AppsEngineNodeRuntime;
    }
}

export function getRuntime() {
    return _getRuntime(process.env?.ROCKETCHAT_APPS_ENGINE_RUNTIME);
}

export function _getDenoRuntime() {
    const runtime = new AppsEngineDenoRuntime();

    runtime.startRuntimeForApp({
        appId: 'appId',
        appSource: 'module.exports={ default: new class { constructor() { this.name = "parangarico" } } };console.log("hi from app")',
    });
}

// Used for testing during dev cycle
if (process.argv.includes('bruh')) {
    _getDenoRuntime();
}
