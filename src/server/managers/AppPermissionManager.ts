import { IPermission } from '../../definition/permission/IPermission';
import { getPermissionsByAppId } from '../AppManager';
import { Bridge } from '../bridges/AppBridges';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { permissionCheckers } from '../permissions';
import { ROCKETCHAT_APP_EXECUTION_PREFIX } from '../ProxiedApp';

interface IBridgeCallDescriptor {
    bridge: string;
    method: string;
    args: Array<any>;
}

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
                            bridge: bridge.constructor.name,
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

    /**
     * It returns the declaration of the permission if the app declared, or it returns `undefined`.
     */
    public static hasPermission(appId: string, permission: IPermission): undefined | IPermission {
        const permissions = getPermissionsByAppId(appId);

        return permissions.find(({ name = '' }) => name === permission.name);
    }

    private static checkPermission(call: IBridgeCallDescriptor): boolean {
        const { bridge, method, args } = call; // 'AppMessageBridge', 'getById', ['mockMessageId', 'mockAppId']

        if (!permissionCheckers[bridge] || !permissionCheckers[bridge][method]) {
            throw new Error(`No permission checker found for the bridge method "${ bridge }.${ method }"\n`
                + 'Please create a new cheker one under the permissionChekers folder to fix the issue.');
        }

        try {
            console.log(bridge, method, permissionCheckers[bridge][method](...args));
            permissionCheckers[bridge][method](...args); // permissionCheckers['AppMessageBridge']['getById']('mockMessageId', 'mockAppId');
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
