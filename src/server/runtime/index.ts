import { AppsEngineNodeRuntime } from './AppsEngineNodeRuntime';
import { AppsEngineVM2Runtime } from './AppsEngineVM2Runtime';

export type AvailableRuntime = typeof AppsEngineNodeRuntime | typeof AppsEngineVM2Runtime;

export function _getRuntime(requiredEnv: string = 'vm2'): AvailableRuntime {
    switch (requiredEnv) {
        case 'vm2':
            return AppsEngineVM2Runtime;
        default:
            return AppsEngineNodeRuntime;
    }
}

export function getRuntime() {
    return _getRuntime(process.env?.ROCKETCHAT_APPS_ENGINE_RUNTIME || '');
}
