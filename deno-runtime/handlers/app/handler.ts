import { Defined, JsonRpcError } from 'jsonrpc-lite';
import handleConstructApp from './construct.ts';
import handleInitialize from './initialize.ts';

export default async function handleApp(method: string, params: unknown): Promise<Defined | JsonRpcError> {
    const [, appMethod] = method.split(':');

    try {
        switch (appMethod) {
            case 'construct':
                return await handleConstructApp(params);
            case 'initialize':
                return await handleInitialize();
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
