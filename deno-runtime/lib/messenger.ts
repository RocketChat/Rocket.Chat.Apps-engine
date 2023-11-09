import * as jsonrpc from 'jsonrpc-lite';

export type RequestDescriptor = Pick<jsonrpc.RequestObject, 'method' | 'params'>;

export type NotificationDescriptor = Pick<jsonrpc.NotificationObject, 'method' | 'params'>;

export type SuccessResponseDescriptor = Pick<jsonrpc.SuccessObject, 'id' | 'result'>;

export type ErrorResponseDescriptor = Pick<jsonrpc.ErrorObject, 'id' | 'error'>;

export type JsonRpcRequest = jsonrpc.IParsedObjectRequest | jsonrpc.IParsedObjectNotification;
export type JsonRpcResponse = jsonrpc.IParsedObjectSuccess | jsonrpc.IParsedObjectError;

export function isRequest(message: jsonrpc.IParsedObject): message is JsonRpcRequest {
    return message.type === 'request' || message.type === 'notification';
}

export function isResponse(message: jsonrpc.IParsedObject): message is JsonRpcResponse {
    return message.type === 'success' || message.type === 'error';
}

export function isErrorResponse(message: jsonrpc.JsonRpc): message is jsonrpc.ErrorObject {
    return message instanceof jsonrpc.ErrorObject;
}

const encoder = new TextEncoder();
export const RPCResponseObserver = new EventTarget();

export function parseMessage(message: string) {
    const parsed = jsonrpc.parse(message);

    if (Array.isArray(parsed)) {
        throw jsonrpc.error(null, jsonrpc.JsonRpcError.invalidRequest(null));
    }

    if (parsed.type === 'invalid') {
        throw jsonrpc.error(null, parsed.payload);
    }

    return parsed;
}

export async function send(message: jsonrpc.JsonRpc): Promise<void> {
    const encoded = encoder.encode(message.serialize());
    await Deno.stdout.write(encoded);
}

export async function sendInvalidRequestError(): Promise<void> {
    const rpc = jsonrpc.error(null, jsonrpc.JsonRpcError.invalidRequest(null));

    await send(rpc);
}

export async function sendInvalidParamsError(id: jsonrpc.ID): Promise<void> {
    const rpc = jsonrpc.error(id, jsonrpc.JsonRpcError.invalidParams(null));

    await send(rpc);
}

export async function sendParseError(): Promise<void> {
    const rpc = jsonrpc.error(null, jsonrpc.JsonRpcError.parseError(null));

    await send(rpc);
}

export async function sendMethodNotFound(id: jsonrpc.ID): Promise<void> {
    const rpc = jsonrpc.error(id, jsonrpc.JsonRpcError.methodNotFound(null));

    await send(rpc);
}

export async function errorResponse({ error: { message, code = -32000, data }, id }: ErrorResponseDescriptor): Promise<void> {
    const rpc = jsonrpc.error(id, new jsonrpc.JsonRpcError(message, code, data));

    await send(rpc);
}

export async function successResponse({ id, result }: SuccessResponseDescriptor): Promise<void> {
    const rpc = jsonrpc.success(id, result);

    await send(rpc);
}

export async function sendRequest(requestDescriptor: RequestDescriptor): Promise<jsonrpc.SuccessObject> {
    const request = jsonrpc.request(Math.random().toString(36).slice(2), requestDescriptor.method, requestDescriptor.params);

    await send(request);

    return new Promise((resolve, reject) => {
        const handler = (event: Event) => {
            if (event instanceof ErrorEvent) {
                reject(event.error);
            }

            if (event instanceof CustomEvent) {
                resolve(event.detail);
            }

            RPCResponseObserver.removeEventListener(`response:${request.id}`, handler);
        };

        RPCResponseObserver.addEventListener(`response:${request.id}`, handler);
    });
}

export function sendNotification({ method, params }: NotificationDescriptor) {
    const request = jsonrpc.notification(method, params);

    send(request);
}