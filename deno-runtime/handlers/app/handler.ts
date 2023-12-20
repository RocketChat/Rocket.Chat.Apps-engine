import { Defined, JsonRpcError } from "jsonrpc-lite";
import { handlInitializeApp } from "./construct.ts";

export default async function handleApp(method: string, params: unknown): Promise<Defined | JsonRpcError> {
    const [, appMethod] = method.split(':');

    let result: Defined;

    try {
        if (appMethod === 'construct') {
            result = await handlInitializeApp(params);
        } else {
            result = null;
        }
    } catch (e: unknown) {
        if (!(e instanceof Error)) {
            return new JsonRpcError('Unknown error', -32000, e);
        }

        if ((e.cause as string)?.includes('invalid_param_type')) {
            return JsonRpcError.invalidParams(null);
        }

        return new JsonRpcError(e.message, -32000, e);
    }

    return result;
}
