import * as net from 'net';

import { ForbiddenNativeModuleAccess } from '.';
import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../../permissions/AppPermissions';

const netModuleBlockList = [
    'createServer', 'Server',
];

export const netModuleHandler = (appId: string): ProxyHandler<typeof net> => ({
    get(target, prop: string, receiver) {
        if (netModuleBlockList.includes(prop)) {
            throw new ForbiddenNativeModuleAccess('net', prop);
        }

        if (!AppPermissionManager.hasPermission(appId, AppPermissions.networking.general)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.networking.general],
            });
        }

        return Reflect.get(target, prop, receiver);
    },
});
