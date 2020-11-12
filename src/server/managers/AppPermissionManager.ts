import { AppPermission } from '../../definition/permission/AppPermission';
import { IPermissionCheckers } from '../../definition/permission/IPermissionCheckers';
import { Bridge } from '../bridges/AppBridges';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { ROCKETCHAT_APP_EXECUTION_PREFIX } from '../ProxiedApp';

interface IBridgeCallDescriptor {
    bridge: string;
    method: string;
    args: Array<any>;
}

const permissionCheckers: IPermissionCheckers = {
    AppMessageBridge: {
        getById(messageId: string, appId: string) {
            throw new PermissionDeniedError(appId, [
                AppPermission.MessageRead,
                AppPermission.MessageWrite,
            ]);
        },
    },
};

export class AppPermissionManager {
    public static proxy<T extends Bridge & { [key: string]: any }>(bridge: T): T {
        const handler = {
            get(target, prop, receiver) {
                const reflection = Reflect.get(target, prop, receiver);

                if (typeof prop === 'symbol' || typeof prop === 'number') {
                    return reflection;
                }

                if (typeof target[prop] === 'function') {
                    return (...args: Array<any>) => {
                        const hasPermission = AppPermissionManager.checkPermission({
                            bridge: bridge.name,
                            method: prop,
                            args,
                        });

                        if (!hasPermission) {
                            return;
                        }

                        return reflection.apply(target, args);
                    };
                }
            },
        } as ProxyHandler<T>;

        return new Proxy(bridge, handler);
    }

    public static checkPermission(call: IBridgeCallDescriptor): boolean {
        const { bridge, method, args } = call;

        // allow bridge calls by default to keep forward compatibility
        if (!permissionCheckers[bridge] || !permissionCheckers[bridge][method]) {
            return;
        }

        try {
            permissionCheckers[bridge][method](...args);
        } catch (err) {
            if (err instanceof PermissionDeniedError) {
                const { name, message } = err;

                console.error(`${ name }: ${ message }\n${ this.getCallStack() }`);
                return false;
            }
            console.error(err);
            return false;
        }
    }

    private static getCallStack(): string {
        const stack = new Error().stack.toString().split('\n');
        const appStackIndex = stack.findIndex((position) => position.includes(ROCKETCHAT_APP_EXECUTION_PREFIX));

        return stack.slice(4, appStackIndex).join('\n');
    }
}
