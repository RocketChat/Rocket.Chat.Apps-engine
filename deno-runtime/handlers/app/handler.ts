import { Defined, JsonRpcError } from 'jsonrpc-lite';

import handleConstructApp from './construct.ts';
import handleInitialize from './handleInitialize.ts';
import handleGetStatus from './handleGetStatus.ts';
import handleSetStatus from './handleSetStatus.ts';
import handleOnEnable from './handleOnEnable.ts';
import handleOnInstall from './handleOnInstall.ts';
import handleOnDisable from './handleOnDisable.ts';
import handleOnUninstall from './handleOnUninstall.ts';
import handleOnPreSettingUpdate from './handleOnPreSettingUpdate.ts';
import handleOnSettingUpdated from './handleOnSettingUpdated.ts';

export default async function handleApp(method: string, params: unknown): Promise<Defined | JsonRpcError> {
    const [, appMethod] = method.split(':');

    try {
        switch (appMethod) {
            case 'construct':
                return await handleConstructApp(params);
            case 'initialize':
                return await handleInitialize();
            case 'getStatus':
                return await handleGetStatus();
            case 'setStatus':
                return await handleSetStatus(params);
            case 'onEnable':
                return await handleOnEnable();
            case 'onDisable':
                return await handleOnDisable();
            case 'onInstall':
                return await handleOnInstall(params);
            case 'onUninstall':
                return await handleOnUninstall(params);
            case 'onPreSettingUpdate':
                return await handleOnPreSettingUpdate(params);
            case 'onSettingUpdated':
                return await handleOnSettingUpdated(params);
            default:
                throw new JsonRpcError('Method not found', -32601);
        }
    } catch (e: unknown) {
        if (!(e instanceof Error)) {
            return new JsonRpcError('Unknown error', -32000, e);
        }

        if ((e.cause as string)?.includes('invalid_param_type')) {
            return JsonRpcError.invalidParams(null);
        }

        if ((e.cause as string)?.includes('invalid_app')) {
            return JsonRpcError.internalError({ message: 'App unavailable' });
        }

        return new JsonRpcError(e.message, -32000, e);
    }
}
